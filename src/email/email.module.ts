import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bron } from '../bron/entities/bron.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bron])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
