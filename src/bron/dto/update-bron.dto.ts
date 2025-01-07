import { IsEnum, IsOptional, IsNumber, IsDate } from 'class-validator';
import { BronStatus } from '../entities/bron.entity'; // BronStatus enumini import qilish
import { ApiProperty } from '@nestjs/swagger'; // Swagger uchun import

export class UpdateBronDto {
  @ApiProperty({
    description: 'Foydalanuvchi identifikatori (ixtiyoriy)',
    example: 1,
  })
  @IsOptional()
  client_id?: number; // Foydalanuvchi identifikatori

  @ApiProperty({
    description: 'Mashina identifikatori (ixtiyoriy)',
    example: 1,
  })
  @IsOptional()
  car_id?: number; // Mashina identifikatori

  @ApiProperty({
    description: 'Rezervatsiya boshlanish sanasi (ixtiyoriy)',
    example: '2024-09-10T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate({ message: "Boshlanish sanasi to'g'ri formatda bo'lishi kerak." })
  start_Date?: Date; // Rezervatsiya boshlanish sanasi

  @ApiProperty({
    description: 'Rezervatsiya tugash sanasi (ixtiyoriy)',
    example: '2024-09-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate({ message: "Tugash sanasi to'g'ri formatda bo'lishi kerak." })
  end_date?: Date; // Rezervatsiya tugash sanasi

  @ApiProperty({
    description: 'Rezervatsiya narxi (ixtiyoriy)',
    example: 100.5,
  })
  @IsOptional()
  @IsNumber({}, { message: "Narx raqam bo'lishi kerak." })
  total_price?: number; // Rezervatsiya narxi

  @ApiProperty({
    description: 'Rezervatsiyaning hozirgi holati (ixtiyoriy)',
    enum: BronStatus,
  })
  @IsOptional()
  @IsEnum(BronStatus, { message: "Holat to'g'ri tanlanishi shart." })
  status?: BronStatus; // Holati
}
