import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Bron } from './entities/bron.entity';
import { CreateBronDto } from './dto/create-bron.dto';
import { UpdateBronDto } from './dto/update-bron.dto';
import { User } from '../users/entities/user.entity';
import { Car } from '../car/entities/car.entity';
import { EmailService } from '../email/email.service'; // Assuming you have a mail service for sending emails

@Injectable()
export class BronService {
  constructor(
    @InjectRepository(Bron) private bronRepo: Repository<Bron>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Car) private carRepo: Repository<Car>,
    private mailService: EmailService,
  ) {}

  async create(createBronDto: CreateBronDto) {
    const { client_id, car_id, start_Date, end_date } = createBronDto;

    const [user, car] = await Promise.all([
      this.userRepo.findOne({ where: { id: client_id } }),
      this.carRepo.findOne({ where: { id: car_id } }),
    ]);

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi!');
    }
    if (!car) {
      throw new NotFoundException('Mashina topilmadi!');
    }

    const existingBron = await this.bronRepo.findOne({
      where: {
        car_id: car,
        start_Date: LessThan(end_date),
        end_date: MoreThan(start_Date),
      },
    });

    if (existingBron) {
      throw new ConflictException("Ushbu mashina bu vaqt oralig'ida band!");
    }

    const startDate = new Date(start_Date);
    const endDate = new Date(end_date);
    const durationInDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const totalPrice = durationInDays * car.price;

    const bron = this.bronRepo.create({
      ...createBronDto,
      client_id: user,
      car_id: car,
      total_price: totalPrice,
    });

    const savedBron = await this.bronRepo.save(bron);

    // Send email notification to the car owner
    await this.mailService.sendCarOwnerNotification(car.user.email, savedBron);

    return savedBron;
  }

  // Find all bron
  async findAll() {
    return await this.bronRepo.find({
      relations: ['client_id', 'car_id'],
    });
  }

  // Find one bron by ID
  async findOne(id: number) {
    const bron = await this.bronRepo.findOne({
      where: { id },
      relations: ['client_id', 'car_id'],
    });

    if (!bron) {
      throw new NotFoundException('Bron topilmadi!');
    }

    return bron;
  }

  // Update a bron by ID
  async update(id: number, updateBronDto: UpdateBronDto) {
    const bron = await this.bronRepo.findOne({
      where: { id },
      relations: ['car_id'],
    });

    if (!bron) {
      throw new NotFoundException('Bron topilmadi!');
    }

    const { start_Date, end_date } = updateBronDto;

    // Check if the car is already booked in the new date range
    if (start_Date || end_date) {
      const existingBron = await this.bronRepo.findOne({
        where: {
          car_id: bron.car_id,
          start_Date: LessThan(end_date),
          end_date: MoreThan(start_Date),
        },
      });

      if (existingBron && existingBron.id !== bron.id) {
        throw new ConflictException("Ushbu mashina bu vaqt oralig'ida band!");
      }

      // Calculate total price if dates are updated
      const car = await this.carRepo.findOne({ where: { id: bron.car_id.id } });
      if (!car) {
        throw new NotFoundException('Mashina topilmadi!');
      }

      const startDate = new Date(start_Date);
      const endDate = new Date(end_date);
      const durationInDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      bron.total_price = durationInDays * car.price;
    }

    Object.assign(bron, updateBronDto);

    return await this.bronRepo.save(bron);
  }

  async remove(id: number) {
    const bron = await this.bronRepo.findOne({ where: { id } });

    if (!bron) {
      throw new NotFoundException('Bron topilmadi!');
    }

    await this.bronRepo.remove(bron);
    return { message: "Bron muvaffaqiyatli o'chirildi!" };
  }
}
