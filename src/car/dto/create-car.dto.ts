import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ description: 'Mashina markasi', example: 'Toyota' })
  @IsString()
  @IsNotEmpty({ message: 'Marka majburiy' })
  marka: string;

  @ApiProperty({ description: 'Mashina modeli', example: 'Camry' })
  @IsString()
  @IsNotEmpty({ message: 'Model majburiy' })
  model: string;

  @ApiProperty({ description: 'Ishlab chiqarilgan yili', example: 2020 })
  @IsNumber()
  @Min(1900, { message: "Yil 1900 yildan keyingi bo'lishi kerak" })
  @Max(new Date().getFullYear(), {
    message: `Yil ${new Date().getFullYear()} yildan katta bo'lmasligi kerak`,
  })
  year: number;

  @ApiProperty({ description: 'Mashina rangi', example: 'Oq' })
  @IsString()
  @IsNotEmpty({ message: 'Rang majburiy' })
  color: string;

  @ApiProperty({
    description: 'Mashinaning narxi (soatlik yoki kunlik)',
    example: 50000,
  })
  @IsNumber()
  @Min(0, { message: "Narx noldan katta bo'lishi kerak" })
  price: number;

  @ApiProperty({
    description: 'Narx turi: kunlik yoki soatlik',
    example: 'daily',
  })
  @IsEnum(['daily', 'hourly'], {
    message: 'Narx turi "daily" yoki "hourly" bo\'lishi kerak',
  })
  priceType: 'daily' | 'hourly';

  @ApiProperty({ description: 'Mashina holati', example: 'Yaxshi' })
  @IsString()
  @IsNotEmpty({ message: 'Holat majburiy' })
  condition: string;

  @ApiProperty({
    description: 'Yoqilgʻi turi (benzin, dizel, elektr)',
    example: 'Benzin',
  })
  @IsString()
  @IsNotEmpty({ message: 'Yoqilgʻi turi majburiy' })
  fuelType: string;

  @ApiProperty({
    description: 'Mashina joylashgan viloyat ID raqami',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Viloyat majburiy' })
  regionId: number;

  @ApiProperty({
    description: 'Mashina joylashgan tuman ID raqami',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Tuman majburiy' })
  districtId: number;
}
