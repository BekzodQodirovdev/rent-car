import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/UserGuard';

@ApiTags('Cars')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protect this route with the guard
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi mashina yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Mashina muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({ status: 401, description: 'Noto‘g‘ri kirish' })
  async create(
    @Body() createCarDto: CreateCarDto,
    @Headers('Authorization') token: string,
  ) {
    return this.carService.addCar(createCarDto, token);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha mashinalarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Barcha mashinalar muvaffaqiyatli qaytarildi.',
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov parametrlari." })
  @ApiResponse({ status: 404, description: 'Mashinalar topilmadi!' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Natijalar sahifasi (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Sahifadagi natijalar soni (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: "Mashina modellarini qidirish uchun kalit so'z",
  })
  @ApiQuery({
    name: 'priceMin',
    required: false,
    type: Number,
    description: 'Minimal narx filtri',
  })
  @ApiQuery({
    name: 'priceMax',
    required: false,
    type: Number,
    description: 'Maksimal narx filtri',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Mashina yilini filtrlash',
  })
  @ApiQuery({
    name: 'fuelType',
    required: false,
    type: String,
    description: 'Yoqilg\'i turi (masalan, "benzin", "dizel")',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('year') year?: number,
    @Query('fuelType') fuelType?: string,
  ) {
    return this.carService.findAll(
      page,
      limit,
      search,
      priceMin,
      priceMax,
      year,
      fuelType,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: "Mashinani ID bo'yicha topish" })
  @ApiResponse({ status: 200, description: 'Mashina muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi!' })
  @ApiParam({ name: 'id', description: 'Mashinani ID raqami' })
  async findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Protect this route with the guard
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mashina maʼlumotlarini yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Mashina maʼlumotlari muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 401, description: 'Noto‘g‘ri kirish' })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi!' })
  @ApiParam({ name: 'id', description: 'Mashinani ID raqami' })
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Headers('Authorization') token: string,
  ) {
    return this.carService.updateCar(+id, updateCarDto, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect this route with the guard
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mashinani o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Mashina muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi!' })
  @ApiParam({ name: 'id', description: 'Mashinani ID raqami' })
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') token: string,
  ) {
    return this.carService.remove(+id, token);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(JwtAuthGuard) // Protect this route with the guard
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mashinaga rasm qo'shish" })
  @ApiResponse({ status: 201, description: "Rasm muvaffaqiyatli qo'shildi." })
  @ApiResponse({ status: 401, description: 'Noto‘g‘ri kirish' })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi!' })
  @ApiParam({ name: 'id', description: 'Mashinani ID raqami' })
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.carService.uploadPhoto(+id, photo);
  }

  @Delete(':id/photo/:photoId')
  @UseGuards(JwtAuthGuard) // Protect this route with the guard
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mashinadan rasmni o'chirish" })
  @ApiResponse({ status: 200, description: "Rasm muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: 'Rasm yoki mashina topilmadi!' })
  @ApiParam({ name: 'id', description: 'Mashinani ID raqami' })
  @ApiParam({ name: 'photoId', description: 'Rasm ID raqami' })
  async removePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    return this.carService.removePhoto(+id, +photoId);
  }
}
