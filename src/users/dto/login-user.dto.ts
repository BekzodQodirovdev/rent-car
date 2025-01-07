import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: "Email manzil noto'g'ri formatda kiritilgan" })
  @IsNotEmpty({ message: "Email manzil bo'sh bo'lmasligi kerak" })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'P@ssw0rd!',
  })
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  @MaxLength(20, { message: 'Parol 12 ta belgidan oshmasligi kerak' })
  password: string;
}
