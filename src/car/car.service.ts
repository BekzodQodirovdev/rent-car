import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CarImages } from './entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { District } from '../district/entities/district.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepo: Repository<Car>,
    @InjectRepository(CarImages) private imgRepo: Repository<CarImages>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(District) private districtRepo: Repository<District>,
    private jwtService: JwtService,
    private photoService: CloudinaryService,
  ) {}

  async verifyToken(token: string): Promise<any> {
    if (!token) throw new UnauthorizedException('Token not provided');

    try {
      return this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async addCar(addCar: CreateCarDto, token: string) {
    const { id } = await this.verifyToken(token);
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found!');

    const district = await this.districtRepo.findOneBy({
      id: addCar.districtId,
    });
    if (!district) throw new NotFoundException('District not found!');

    const newCar = this.carRepo.create({ ...addCar, user, district });
    const savedCar = await this.carRepo.save(newCar);

    return { message: 'Car created successfully!', data: savedCar };
  }

  // Update a car, ensuring only the owner can update it
  async updateCar(id: number, updateCarDto: UpdateCarDto, token: string) {
    // Decode the token to get the user ID
    const data = await this.verifyToken(token);
    const userId = data.id;
    // Find the car by ID
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    // If the car doesn't exist, throw an exception
    if (!car) throw new NotFoundException('Car not found!');

    // Check if the authenticated user is the owner of the car
    if (car.user.id !== userId) {
      throw new ForbiddenException('Sizda bunday ruxsat yo`q!');
    }

    // If district is updated, check if the new district exists
    if (updateCarDto.districtId) {
      const district = await this.districtRepo.findOneBy({
        id: updateCarDto.districtId,
      });
      if (!district) throw new NotFoundException('District not found!');
      car.district = district;
    }

    // Update the car properties with the provided data
    Object.assign(car, updateCarDto);

    // Save the updated car
    const updatedCar = await this.carRepo.save(car);

    return { message: 'Car updated successfully!', data: updatedCar };
  }

  // Upload photo for a car
  async uploadPhoto(id: number, photo: Express.Multer.File) {
    const car = await this.findCarWithImages(id);
    const img = await this.photoService.uploadImage(photo);

    const newImg = this.imgRepo.create({ photo: img.url, car });
    await this.imgRepo.save(newImg);

    car.images.push(newImg);
    const updatedCar = await this.carRepo.save(car);

    return { message: 'Photo uploaded successfully!', data: updatedCar };
  }

  // Remove a car photo
  async removePhoto(id: number, photoId: number) {
    const car = await this.findCarWithImages(id);
    const photo = await this.imgRepo.findOneBy({ id: photoId, car: { id } });

    if (!photo) throw new NotFoundException('Photo not found!');

    await this.photoService.removeImageByUrl(photo.photo);
    await this.imgRepo.remove(photo);

    return { message: 'Photo removed successfully!', data: car };
  }

  // Find all cars with optional filters
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    priceMin?: number,
    priceMax?: number,
    year?: number,
    fuelType?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Car> = this.buildWhereConditions(
      search,
      priceMin,
      priceMax,
      year,
      fuelType,
    );

    const [cars, total] = await this.carRepo.findAndCount({
      where,
      skip,
      take: limit,
    });

    return { data: cars, total, page, limit };
  }

  // Find car by ID
  findOne(id: number) {
    return this.carRepo.findOne({
      where: { id },
      relations: ['images', 'user', 'district'],
    });
  }

  async remove(id: number, token: string) {
    const data = await this.verifyToken(token);
    const userId = data?.id;
    // Find the car by ID
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (car.user.id !== userId)
      throw new ForbiddenException('Sizda bunday ruxsat yo`q!');

    if (!car) throw new NotFoundException('Car not found!');

    await this.carRepo.remove(car);
    return { message: 'Car removed successfully!' };
  }

  private async findCarWithImages(id: number): Promise<Car> {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!car) throw new NotFoundException('Car not found!');
    return car;
  }

  // Utility function: Build where conditions for the findAll method
  private buildWhereConditions(
    search?: string,
    priceMin?: number,
    priceMax?: number,
    year?: number,
    fuelType?: string,
  ): FindOptionsWhere<Car> {
    const where: FindOptionsWhere<Car> = {};

    if (search) {
      where.model = Like(`%${search}%`);
      where.marka = Like(`%${search}%`);
      where.color = Like(`%${search}%`);
      where.fuelType = Like(`%${search}%`);

      const yearSearch = Number(search);
      if (!isNaN(yearSearch)) {
        where.year = yearSearch;
      }
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = Between(priceMin ?? 0, priceMax ?? Number.MAX_VALUE);
    }

    if (year !== undefined) {
      where.year = year;
    }

    if (fuelType) {
      where.fuelType = fuelType;
    }

    return where;
  }
}
