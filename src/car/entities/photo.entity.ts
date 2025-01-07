import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Car } from './car.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('car_images')
export class CarImages {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Rasm ID raqami' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Rasmning URL yoki fayl yo‘li' })
  photo: string;

  @ManyToOne(() => Car, (car) => car.images, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'Rasmga tegishli mashina ID raqami',
    type: () => Car,
  })
  car: Car;
}
