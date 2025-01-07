// district.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from '../../region/entities/region.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Car } from '../../car/entities/car.entity';

@Entity('district')
export class District {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the district' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the district' })
  name: string;

  @ManyToOne(() => Region, (region) => region.districts)
  @ApiProperty({
    description: 'The region this district belongs to',
    type: () => Region,
  })
  region: Region; // Ensure that Region entity has districts property

  @OneToMany(() => Car, (car) => car.district)
  cars: Car[];
}
