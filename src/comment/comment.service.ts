// comment.service.ts
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Car } from '../car/entities/car.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Car) private carRepo: Repository<Car>,
    private jwtService: JwtService,
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

  // Create a new comment
  async create(createCommentDto: CreateCommentDto, token: string) {
    const { carId } = createCommentDto;
    const data = await this.verifyToken(token);

    const user = await this.userRepo.findOneBy({ id: data.id });
    const car = await this.carRepo.findOneBy({ id: carId });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi!`);
    }

    if (!car) {
      throw new NotFoundException(`Mashina topilmadi`);
    }

    const comment = this.commentRepo.create(createCommentDto);
    return await this.commentRepo.save(comment);
  }

  // Find all comments with pagination
  async findAll(page: number = 1, limit: number = 10) {
    const [comments, total] = await this.commentRepo.findAndCount({
      relations: ['user', 'car'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: comments,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'car'],
    });
    if (!comment) {
      throw new NotFoundException(`Bu Izoh topilmadi`);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, token: string) {
    const data = await this.verifyToken(token);
    const user = await this.userRepo.findOneBy({ id: data.id });
    if (!user) throw new NotFoundException('Bunday foydalanuvchi topilmadi!');

    const comment = await this.commentRepo.findOneBy({ id, user: data.id });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepo.save(comment);
  }

  async remove(id: number, token: string) {
    const data = await this.verifyToken(token);
    const user = await this.userRepo.findOneBy({ id: data.id });
    if (!user) throw new NotFoundException('Bunday foydalanuvchi topilmadi!');

    const comment = await this.commentRepo.findOneBy({ id, user: data.id });
    await this.commentRepo.remove(comment);
    return { message: `Comment with ID ${id} successfully removed` };
  }
}
