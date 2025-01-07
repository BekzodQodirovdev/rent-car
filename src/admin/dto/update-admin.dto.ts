import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
  })
  @IsOptional() // Indicates that this field is optional
  @MaxLength(50, { message: 'Ism 50 ta belgidan oshmasligi kerak' }) // Max length of 50
  fname?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional() // Indicates that this field is optional
  @IsEmail({}, { message: "Email manzil noto'g'ri formatda kiritilgan" }) // Invalid email format
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the user account',
    example: 'P@ssw0rd!',
  })
  @IsOptional() // Indicates that this field is optional
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }) // Min length of 6
  @MaxLength(20, { message: 'Parol 20 ta belgidan oshmasligi kerak' }) // Max length of 20
  password?: string;
}
