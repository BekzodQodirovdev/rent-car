import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddAdminDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsNotEmpty({ message: "Ism bo'sh bo'lmasligi kerak" }) // First name cannot be empty
  @MaxLength(50, { message: 'Ism 50 ta belgidan oshmasligi kerak' }) // Max length of 50
  fname: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: "Email manzil noto'g'ri formatda kiritilgan" }) // Invalid email format
  @IsNotEmpty({ message: "Email manzil bo'sh bo'lmasligi kerak" }) // Email cannot be empty
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'P@ssw0rd!',
  })
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" }) // Password cannot be empty
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }) // Min length of 6
  @MaxLength(20, { message: 'Parol 12 ta belgidan oshmasligi kerak' }) // Max length of 20
  password: string;
}
