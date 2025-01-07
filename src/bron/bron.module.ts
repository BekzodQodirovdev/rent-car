import { Module } from '@nestjs/common';
import { BronService } from './bron.service';
import { BronController } from './bron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bron } from './entities/bron.entity';
import { User } from '../users/entities/user.entity';
import { Car } from '../car/entities/car.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bron, User, Car]),
    JwtModule, // JWT modulini qo'shish
    // EmailService ni importsdan olib tashlang
  ],
  controllers: [BronController],
  providers: [
    BronService,
    EmailService, // EmailService ni providers ga qo'shing
  ],
})
export class BronModule {}
