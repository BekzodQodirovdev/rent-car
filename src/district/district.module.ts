import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from '../region/entities/region.entity';
import { District } from './entities/district.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Region, District]), JwtModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
