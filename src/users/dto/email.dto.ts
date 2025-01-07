import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: 'email', example: 'example@mail.com' })
  @IsEmail({}, { message: "Noto'g'ri elektron pochta manzili kiritilgan" })
  email: string;
}
