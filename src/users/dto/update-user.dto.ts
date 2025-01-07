import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsISO8601,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: "Ism bo'sh bo'lmasligi kerak" }) // First name cannot be empty
  @MaxLength(50, { message: 'Ism 50 ta belgidan oshmasligi kerak' }) // Max length of 50
  fname?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: "Familiya bo'sh bo'lmasligi kerak" }) // Last name cannot be empty
  @MaxLength(50, { message: 'Familiya 50 ta belgidan oshmasligi kerak' }) // Max length of 50
  lname?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Email manzil noto'g'ri formatda kiritilgan" }) // Invalid email format
  @IsNotEmpty({ message: "Email manzil bo'sh bo'lmasligi kerak" }) // Email cannot be empty
  email?: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'P@ssw0rd!',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: "Parol bo'sh bo'lmasligi kerak" }) // Password cannot be empty
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }) // Min length of 6
  @MaxLength(20, { message: 'Parol 20 ta belgidan oshmasligi kerak' }) // Max length of 20
  password?: string;

  @ApiProperty({
    description: 'User birthdate in YYYY-MM-DD format',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: "Tug'ilgan kun YYYY-MM-DD formatida kiritilishi kerak",
    },
  ) // Should be in date format
  birthdate?: string; // Add birthdate as an optional string
}
