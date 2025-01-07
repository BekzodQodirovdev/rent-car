import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
import { env } from 'process';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: CustomJwtService,
    private readonly emailService: EmailService,
  ) {}

  // Foydalanuvchini login qilish
  async login(login: LoginUserDto, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({ email: login.email });

      if (!user) {
        throw new UnauthorizedException('Email topilmadi yoki parol xato');
      }

      const passwordMatch = await bcrypt.compare(login.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Email topilmadi yoki parol xato');
      }

      // Tokenlarni generatsiya qilish
      const tokens = this.jwtService.generateTokens(user);

      user.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepository.save(user);

      // Refresh tokenni cookiega saqlash
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 kun
      });
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Yangi foydalanuvchini ro'yxatdan o'tkazish
  async register(createUserDto: CreateUserDto, res: Response) {
    // Check if the user already exists
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(
        "Bu foydalanuvchi allaqachon ro'yxatdan o'tgan",
      );
    }

    // Hash the password
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user instance
    const newUser = this.userRepository.create(createUserDto); // Fix applied here
    await this.userRepository.save(newUser); // Now newUser is correctly defined

    // Generate tokens
    const tokens = this.jwtService.generateTokens(newUser);
    newUser.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(newUser); // Save the new user with the refresh token

    // Save refresh token in a cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true, // Ensure this is true in production
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    // Send activation email
    const token = this.jwtService.generateActivationToken(newUser);
    const activationLink = `http://localhost:4000/${token}`;

    await this.emailService.sendMail(
      newUser.email,
      'Hisobingizni aktivatsiya qiling',
      'activation',
      { activationLink },
    );

    return {
      message: 'Emailga aktivatsiya havolasi yuborildi',
      userId: newUser.id,
      ...tokens,
    };
  }

  // Foydalanuvchini aktivatsiya qilish
  async activateUser(token: string) {
    const payload = this.jwtService.verifyActivationToken(token);
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.is_active = true; // Foydalanuvchini aktiv holatga o'tkazish

    await this.userRepository.save(user);
    return 'Foydalanuvchi muvaffaqiyatli aktivlashtirildi.';
  }

  // Emailni qaytadan jo'natish
  async resendActivationEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (user.is_active) {
      throw new ConflictException('Foydalanuvchi allaqachon aktiv');
    }

    // Aktivatsiya tokenini generatsiya qilish
    const token = this.jwtService.generateActivationToken(user);
    const activationLink = `${env.active_link}${token}`;

    // Aktivatsiya emailini jo'natish
    await this.emailService.sendMail(
      user.email,
      'Hisobingizni aktivatsiya qiling',
      'activation',
      { activationLink },
    );
  }

  // Refresh tokenni yangilash va cookiega saqlash
  async refreshToken(refreshToken: string, res: Response) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user || !user.refreshtoken) {
      throw new UnauthorizedException('Noto‘g‘ri refresh token');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshtoken);
    if (!isMatch) {
      throw new UnauthorizedException('Noto‘g‘ri refresh token');
    }

    // Yangi tokenlarni generatsiya qilish
    const tokens = this.jwtService.generateTokens(user);

    // Yangi refresh tokenni hash qilib saqlash
    user.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(user);

    // Refresh tokenni cookiega saqlash
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true, // Yaltiroq muhitda HTTPS bo'lishi kerak
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 kun
    });

    return tokens; // Yangi tokenlarni qaytarish
  }

  // Logout funksiyasi
  async logout(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi`);
    }

    user.refreshtoken = null; // Refresh tokenni o'chirish
    await this.userRepository.save(user);

    return { message: 'Token o`chirildi' };
  }

  // Barcha foydalanuvchilarni olish
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: User[]; count: number }> {
    const [result, total] = await this.userRepository.findAndCount({
      where: search
        ? [{ fname: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
        : undefined,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: result,
      count: total,
    };
  }

  // ID bo'yicha bitta foydalanuvchini topish
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi #${id} topilmadi`);
    }
    return user;
  }

  // ID bo'yicha foydalanuvchini yangilash
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  // ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.is_active = false; // Foydalanuvchini deaktivatsiya qilish
    await this.userRepository.save(user);
  }

  // Parolni unutish (Forgot Password)
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Parolni tiklash tokenini generatsiya qilish
    const token = this.jwtService.generatePasswordResetToken(user);
    const resetLink = `http://localhost:4000/api/users/reset-password?token=${token}`;

    // Parolni tiklash emailini jo'natish
    await this.emailService.sendMail(
      user.email,
      'Parolni tiklash',
      'reset-password',
      { resetLink },
    );
    console.log(resetLink);

    return { message: 'Emailingiz habar yuborildi!' };
  }

  // Parolni tiklash (Reset Password)
  async resetPassword(token: string, newPassword: string) {
    const payload = this.jwtService.verifyPasswordResetToken(token);
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    // Yangi parolni hash qilish va saqlash
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Parolingiz yangilandi! ' };
  }
}
