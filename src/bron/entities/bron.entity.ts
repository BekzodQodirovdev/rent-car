import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../car/entities/car.entity';
import { ApiProperty } from '@nestjs/swagger';

// Status enumini aniqlash
export enum BronStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bron')
export class Bron {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @ManyToOne(() => User, { eager: true }) // Foydalanuvchini avtomatik yuklash
  @ApiProperty({ type: () => User, description: ' mijoz id' })
  client_id: User;

  @ManyToOne(() => Car, { eager: true }) // Mashinani avtomatik yuklash
  @ApiProperty({ type: () => Car, description: 'Bron qilinayotgan mashina' })
  car_id: Car;

  @Column()
  @ApiProperty({ description: 'Rezervatsiya boshlanish sanasi' })
  start_Date: Date;

  @Column()
  @ApiProperty({ description: 'Rezervatsiya tugash sanasi' })
  end_date: Date;

  @Column('decimal', { precision: 10, scale: 2 }) // Narxni belgilash
  @ApiProperty({ description: 'bron narxi' })
  total_price: number;

  @Column({ type: 'enum', enum: BronStatus })
  @ApiProperty({
    enum: BronStatus,
    description: 'Rezervatsiyaning hozirgi holati',
  })
  status: BronStatus;
}
