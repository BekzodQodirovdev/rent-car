// car.module.ts
import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarImages } from './entities/photo.entity';
import { District } from '../district/entities/district.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, CarImages, District, Comment, User]),
    CloudinaryModule,
    JwtModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
