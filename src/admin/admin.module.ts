import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomJwtModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
