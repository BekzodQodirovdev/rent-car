import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailDto } from './dto/email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express'; // Import Response from express

@ApiTags('foydalanuvchilar')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Foydalanuvchini ro'yxatdan o'tkazish
  @Post('register')
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiBody({
    description: "Foydalanuvchi ro'yxatga olish uchun kerakli ma'lumotlar",
    type: CreateUserDto,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tgan.",
  })
  @ApiResponse({ status: 409, description: 'Foydalanuvchi allaqachon mavjud.' })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response, // Response obyektini qo'shish
  ) {
    // Foydalanuvchini ro'yxatdan o'tkazish funksiyasini chaqirish
    return this.usersService.register(createUserDto, res);
  }

  // Login qismi
  @Post('login')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Foydalanuvchini kirish' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli kirdi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Foydalanuvchi topilmadi yoki parol xato.',
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response, // Response obyektini qo'shish
  ) {
    // Foydalanuvchini tizimga kiritish
    return this.usersService.login(loginUserDto, res);
  }

  // Barcha foydalanuvchilarni olish
  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Sahifa raqami',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Sahifadagi elementlar soni',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: "Qidiruv so'zi (ismi, nomeri yoki emaili bo'yicha)",
  })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchilar ro'yxati.",
    type: [User],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    // Barcha foydalanuvchilarni olish
    return this.usersService.findAll(page, limit, search);
  }

  // ID bo'yicha foydalanuvchini topish
  @Get(':id')
  @ApiOperation({ summary: "ID bo'yicha foydalanuvchini topish" })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi topildi.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async findOne(@Param('id') id: string) {
    // Foydalanuvchini ID bo'yicha topish
    return this.usersService.findOne(+id);
  }

  // ID bo'yicha foydalanuvchini yangilash
  @Patch(':id')
  @ApiOperation({ summary: "ID bo'yicha foydalanuvchini yangilash" })
  @ApiBody({
    type: UpdateUserDto,
    description:
      "Foydalanuvchi ma'lumotlarini yangilash uchun kerakli ma'lumotlar",
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli yangilandi.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Foydalanuvchini yangilash
    return this.usersService.update(+id, updateUserDto);
  }

  // ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)
  @Delete(':id')
  @ApiOperation({
    summary: "ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)",
  })
  @ApiResponse({
    status: 204,
    description: "Foydalanuvchi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async remove(@Param('id') id: string) {
    // Foydalanuvchini o'chirish
    await this.usersService.remove(+id);
  }

  // Foydalanuvchini aktivatsiya qilish
  @Post('activate')
  @ApiOperation({ summary: 'Foydalanuvchi hisobini aktivatsiya qilish' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli aktivlashtirildi.',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async activateUser(@Query('token') token: string) {
    // Aktivatsiya tokenini tekshirish
    if (!token) {
      throw new InternalServerErrorException('Token zarur.');
    }
    await this.usersService.activateUser(token);
    return { message: 'Foydalanuvchi muvaffaqiyatli aktivlashtirildi.' };
  }

  // Emailni qaytadan jo'natish
  @Post('resend-activation')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: "Aktivatsiya emailini qaytadan jo'natish" })
  @ApiBody({ type: EmailDto })
  @ApiResponse({
    status: 200,
    description: "Aktivatsiya emaili muvaffaqiyatli qaytadan jo'natildi.",
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async resendActivationEmail(@Body() emailDto: EmailDto) {
    // Aktivatsiya emailini qaytadan jo'natish
    await this.usersService.resendActivationEmail(emailDto.email);
  }

  // Refresh tokenni yangilash
  @Post('refresh-token')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Foydalanuvchi tokenini yangilash' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 401, description: "Noto'g'ri refresh token." })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response, // Response obyektini qo'shish
  ) {
    // Tokenni yangilash
    return this.usersService.refreshToken(refreshTokenDto.refreshToken, res);
  }

  // Logout funksiyasi
  @Post('logout/:id')
  @ApiOperation({ summary: 'Foydalanuvchini logout qilish' })
  @ApiResponse({
    status: 204,
    description: 'Foydalanuvchi muvaffaqiyatli logout qilindi.',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async logout(@Param('id') id: string) {
    // Foydalanuvchini logout qilish
    await this.usersService.logout(+id);
  }

  // Parolni tiklash uchun email yuborish
  @Post('forgot-password')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Parolni tiklash uchun email yuborish' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({
    status: 200,
    description: 'Parolni tiklash emaili yuborildi.',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async forgotPassword(@Body() emailDto: EmailDto) {
    // Parolni tiklash uchun email yuborish
    await this.usersService.forgotPassword(emailDto.email);
  }

  // Yangi parolni o'rnatish
  @Get('reset-password')
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: "Yangi parolni o'rnatish",
    description: "Foydalanuvchi yangi parolni o'rnatishi mumkin.",
  })
  @ApiQuery({
    name: 'token',
    type: String,
    description: 'Parolni tiklash uchun token',
    required: true,
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: "Yangi parolni kiritish uchun JSON formatidagi ma'lumot",
  })
  @ApiResponse({
    status: 200,
    description: 'Parol muvaffaqiyatli tiklandi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Foydalanuvchi topilmadi.',
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri parol yoki token.",
  })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { newPassword } = resetPasswordDto;
    // Yangi parolni o'rnatish
    return this.usersService.resetPassword(token, newPassword);
  }
}
