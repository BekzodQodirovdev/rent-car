import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { BronStatus } from '../entities/bron.entity'; // BronStatus enumini import qilish
import { ApiProperty } from '@nestjs/swagger'; // Swagger uchun import

export class CreateBronDto {
  @ApiProperty({
    description: 'Foydalanuvchi identifikatori (majburiy)',
    example: 1,
  })
  @IsNotEmpty({ message: 'Foydalanuvchi identifikatori kiritilishi shart.' })
  client_id: number; // Foydalanuvchi identifikatori

  @ApiProperty({ description: 'Mashina identifikatori (majburiy)', example: 1 })
  @IsNotEmpty({ message: 'Mashina identifikatori kiritilishi shart.' })
  car_id: number; // Mashina identifikatori

  @ApiProperty({
    description: 'Rezervatsiya boshlanish sanasi (majburiy)',
    example: '2024-09-10T00:00:00.000Z',
  })
  @IsDate({ message: "Boshlanish sanasi to'g'ri formatda bo'lishi kerak." })
  @IsNotEmpty({ message: 'Rezervatsiya boshlanish sanasi kiritilishi shart.' })
  start_Date: Date; // Rezervatsiya boshlanish sanasi

  @ApiProperty({
    description: 'Rezervatsiya tugash sanasi (majburiy)',
    example: '2024-09-15T00:00:00.000Z',
  })
  @IsDate({ message: "Tugash sanasi to'g'ri formatda bo'lishi kerak." })
  @IsNotEmpty({ message: 'Rezervatsiya tugash sanasi kiritilishi shart.' })
  end_date: Date; // Rezervatsiya tugash sanasi

  @ApiProperty({ description: 'Rezervatsiya narxi (majburiy)', example: 100.5 })
  @IsNumber({}, { message: "Narx raqam bo'lishi kerak." })
  @IsNotEmpty({ message: 'Rezervatsiya narxi kiritilishi shart.' })
  total_price: number; // Rezervatsiya narxi

  @ApiProperty({
    description: 'Rezervatsiyaning hozirgi holati (ixtiyoriy)',
    enum: BronStatus,
    default: BronStatus.PENDING,
  })
  @IsEnum(BronStatus, { message: "Holat to'g'ri tanlanishi shart." })
  @IsOptional()
  status?: BronStatus = BronStatus.PENDING; // Holati (default - pending)
}
