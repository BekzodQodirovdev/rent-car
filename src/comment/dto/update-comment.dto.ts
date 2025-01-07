// update-comment.dto.ts
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsOptional({ message: 'Reytingni kiritish majburiy emas.' }) // Optional message
  @IsInt({ message: "Reyting faqat butun son bo'lishi kerak." })
  @Min(1, { message: "Reyting minimal qiymati 1 bo'lishi kerak." })
  @Max(5, { message: "Reyting maksimal qiymati 5 bo'lishi kerak." })
  @ApiProperty({
    description: 'Baholash (1 dan 5 gacha)',
    example: 5,
    required: false,
  })
  rating?: number; // Optional for updating

  @IsOptional({ message: 'Fikr matni kiritish majburiy emas.' }) // Optional message
  @IsString({ message: "Fikr matni faqat string bo'lishi kerak." })
  @ApiProperty({
    description: 'Fikr matni',
    example: 'Bu mashina juda yaxshi!',
    required: false,
  })
  comment?: string; // Optional for updating
}
