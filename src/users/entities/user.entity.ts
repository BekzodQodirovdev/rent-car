import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Car } from '../../car/entities/car.entity'; // Car entity'sini import qilish
import { Comment } from '../../comment/entities/comment.entity'; // Comment entity'sini import qilish

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Foydalanuvchi uchun noyob identifikator',
    example: 1,
  })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Foydalanuvchining ismi',
    example: 'John',
  })
  fname: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Foydalanuvchining familiyasi',
    example: 'Doe',
  })
  lname: string;

  @Column({ nullable: true, unique: true }) // Elektron pochta manzili noyob bo'lishi kerak
  @ApiProperty({
    description: 'Foydalanuvchining elektron pochta manzili',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Foydalanuvchi hisobining paroli',
    example: 'P@ssw0rd!',
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Foydalanuvchining tugʻilgan sanasi (YYYY-MM-DD formatida)',
    example: '1990-01-01',
    type: String,
    format: 'date',
  })
  birthdate: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Foydalanuvchining mintaqasi',
    example: 'Namangan',
    type: String,
  })
  region: string;

  @Column({ default: false })
  @ApiProperty({
    description: "Foydalanuvchi hisobining faoliyatini ko'rsatadi",
    example: false,
  })
  is_active: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'Foydalanuvchining autentifikatsiyasi uchun refreshtoken (ixtiyoriy)',
    example: 'refresh-token-value',
    required: false,
  })
  refreshtoken: string;

  @Column({ default: false })
  @ApiProperty({
    description: "Foydalanuvchi super admin ekanligini ko'rsatadi",
    example: false,
  })
  is_super: boolean;

  @Column({ default: false })
  @ApiProperty({
    description:
      "Foydalanuvchining admin huquqlariga ega ekanligini ko'rsatadi",
    example: true,
  })
  admin: boolean;

  @OneToMany(() => Car, (car) => car.user, { cascade: true }) // Mashinalar bilan bog'lanish
  @ApiProperty({
    description: 'Foydalanuvchiga tegishli mashinalar',
    type: () => [Car], // Lazy resolver
  })
  cars: Car[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];
}
