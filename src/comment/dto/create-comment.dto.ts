// create-comment.dto.ts
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsInt({ message: "Baholash faqat butun son bo'lishi kerak." })
  @Min(1, { message: "Baholash minimal qiymati 1 bo'lishi kerak." })
  @Max(5, { message: "Baholash maksimal qiymati 5 bo'lishi kerak." })
  @IsNotEmpty({ message: 'Baholashni kiritish majburiy.' })
  @ApiProperty({ description: 'Baholash (1 dan 5 gacha)', example: 5 })
  rating: number;

  @IsString({ message: "Fikr matni faqat string bo'lishi kerak." })
  @IsNotEmpty({ message: 'Fikr matnini kiritish majburiy.' })
  @ApiProperty({
    description: 'Fikr matni',
    example: 'Bu mashina juda yaxshi!',
  })
  comment: string;

  @IsInt({ message: "Foydalanuvchi ID faqat butun son bo'lishi kerak." })
  @IsNotEmpty({ message: 'Foydalanuvchi ID raqamini kiritish majburiy.' })
  @ApiProperty({ description: 'Foydalanuvchi ID raqami', example: 1 })
  userId: number;

  @IsInt({ message: "Mashina ID faqat butun son bo'lishi kerak." })
  @IsNotEmpty({ message: 'Mashina ID raqamini kiritish majburiy.' })
  @ApiProperty({ description: 'Mashina ID raqami', example: 1 })
  carId: number;
}
