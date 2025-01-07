import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Parol majburiy.' })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "Parolda faqat harflar va raqamlar bo'lishi kerak",
  })
  newPassword: string;
}
