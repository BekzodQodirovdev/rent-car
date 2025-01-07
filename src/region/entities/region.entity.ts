// region.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from '../../district/entities/district.entity'; // Ensure correct path
import { ApiProperty } from '@nestjs/swagger';

@Entity('region')
export class Region {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the region' }) // Swagger property
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the region' }) // Swagger property
  name: string;

  @OneToMany(() => District, (district) => district.region)
  @ApiProperty({
    description: 'List of districts within the region',
    type: () => [District],
  }) // Swagger property
  districts: District[];
}
