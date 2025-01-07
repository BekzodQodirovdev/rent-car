// car.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { District } from '../../district/entities/district.entity';
import { CarImages } from './photo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity'; // Comment entity'sini import qilish

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Mashina ID raqami' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Mashina markasi' })
  marka: string;

  @Column()
  @ApiProperty({ description: 'Mashina modeli' })
  model: string;

  @Column()
  @ApiProperty({ description: 'Mashina ishlab chiqarilgan yili' })
  year: number;

  @Column()
  @ApiProperty({ description: 'Mashina rangi' })
  color: string;

  @Column()
  @ApiProperty({ description: 'Mashinaning narxi (soatlik yoki kunlik)' })
  price: number;

  @Column({ type: 'enum', enum: ['daily', 'hourly'], default: 'daily' })
  @ApiProperty({ description: 'Narx turi: "kunlik" yoki "soatlik"' })
  priceType: 'daily' | 'hourly';

  @OneToMany(() => CarImages, (carImage) => carImage.car, { cascade: true })
  @ApiProperty({ description: 'Mashinaga tegishli rasmlar', type: [CarImages] })
  images: CarImages[];

  @ManyToOne(() => District, (district) => district.cars)
  @JoinColumn({ name: 'district_id' })
  @ApiProperty({ description: 'Mashina joylashgan tuman' })
  district: District;

  @ManyToOne(() => User, (user) => user.cars) // User bilan bog'lanish
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Mashina egasi (foydalanuvchi)',
    type: () => User,
  }) // Lazy resolver
  user: User;

  @Column()
  @ApiProperty({ description: 'Mashina holati (yaxshi, yomon)' })
  condition: string;

  @Column()
  @ApiProperty({ description: "Yoqilg'i turi (benzin, dizel, elektr)" })
  fuelType: string;

  @OneToMany(() => Comment, (comment) => comment.car, { cascade: true })
  comments: Comment[];
}
