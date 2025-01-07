import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CustomJwtService } from '../custom-jwt/custom-jwt.service';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto'; // Import the new DTO

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly adminRepo: Repository<User>,
    private readonly jwtService: CustomJwtService,
  ) {}

  async create(adminDto: AddAdminDto) {
    const existingAdmin = await this.adminRepo.findOneBy({
      email: adminDto.email,
    });
    if (existingAdmin) {
      throw new ConflictException('Bu admin allaqon ro`yxatdan o`tgan!');
    }

    const newAdmin = this.adminRepo.create({
      ...adminDto,
      password: await this.hashPassword(adminDto.password),
      admin: true,
    });

    const savedAdmin = await this.adminRepo.save({
      id: newAdmin.id,
      email: newAdmin.email,
      admin: newAdmin.admin,
    });
    const token = this.jwtService.generateTokens({
      id: savedAdmin.id,
      email: savedAdmin.email,
    }).accessToken;

    return {
      message: 'Admin qo`shildi',
      token,
    };
  }

  async login(loginAdmin: LoginAdminDto) {
    const admin = await this.adminRepo.findOneBy({ email: loginAdmin.email });
    if (
      !admin ||
      !(await this.isPasswordValid(admin.password, loginAdmin.password))
    ) {
      throw new NotFoundException('Bunday admin mavjud emas yoki parol xato!');
    }

    const token = this.jwtService.generateTokens({
      id: admin.id,
      email: admin.email,
      admin: admin.admin,
    });

    return {
      message: 'Admin muvoffaqiyatli login qildi!',
      token,
    };
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const queryBuilder = this.adminRepo
      .createQueryBuilder('admin')
      .where({ admin: true });

    if (search) {
      queryBuilder.andWhere(
        'admin.fname LIKE :search OR admin.email LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [result, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const adminsResponse = result.map((admin) => ({
      id: admin.id,
      fname: admin.fname,
      email: admin.email,
      admin: admin.admin,
      is_super: admin.is_super,
    }));

    return {
      data: adminsResponse,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findOneBy({ id, admin: true });
    if (!admin) throw new NotFoundException('Bunday admin mavjud emas!');

    return {
      id: admin.id,
      fname: admin.fname,
      email: admin.email,
      admin: admin.admin,
      is_super: admin.is_super,
    };
  }

  async update(id: number, updAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepo.findOneBy({ id, admin: true });
    if (!admin) throw new NotFoundException('Bunday admin mavjud emas!');

    if (updAdminDto.email) {
      await this.checkEmailConflict(updAdminDto.email, id);
    }

    if (updAdminDto.password) {
      updAdminDto.password = await this.hashPassword(updAdminDto.password);
    }

    const updatedAdmin = Object.assign(admin, updAdminDto);
    await this.adminRepo.save(updatedAdmin);

    return { message: 'Admin muvoffaqiyatli yangilandi' };
  }

  async remove(id: number) {
    const admin = await this.adminRepo.findOneBy({ id, admin: true });
    if (!admin) throw new NotFoundException('Bunday admin mavjud emas!');

    await this.adminRepo.delete({ id });

    return { message: "Admin muvaffaqiyatli o'chirildi." };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async isPasswordValid(
    storedPassword: string,
    inputPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  private async checkEmailConflict(email: string, adminId: number) {
    const existingAdminWithEmail = await this.adminRepo.findOneBy({ email });
    if (existingAdminWithEmail && existingAdminWithEmail.id !== adminId) {
      throw new ConflictException(
        'Bu email allaqachon boshqa foydalanuvchi ishlatilmoqda!',
      );
    }
  }
}
