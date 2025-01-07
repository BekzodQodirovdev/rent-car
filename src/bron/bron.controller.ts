import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BronService } from './bron.service';
import { CreateBronDto } from './dto/create-bron.dto';
import { UpdateBronDto } from './dto/update-bron.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/AdminGuard'; // AdminGuardni import qilish

@ApiTags('bron') // Guruhlash uchun teg
@Controller('bron')
export class BronController {
  constructor(private readonly bronService: BronService) {}

  @Post()
  @UseGuards(AdminGuard) // Yaratish metodiga AdminGuardni qo'llash
  @ApiOperation({ summary: 'Yangi bron yaratish' })
  @ApiResponse({ status: 201, description: 'Bron muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 403, description: 'Ta’qiqlangan.' })
  create(@Body() createBronDto: CreateBronDto) {
    return this.bronService.create(createBronDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha bronlarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Barcha bronlar muvaffaqiyatli olindi.',
  })
  findAll() {
    return this.bronService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "ID bo'yicha bronni olish" })
  @ApiResponse({ status: 200, description: 'Bron muvaffaqiyatli olindi.' })
  @ApiResponse({ status: 404, description: 'Bron topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.bronService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard) // Yangilash metodiga AdminGuardni qo'llash
  @ApiOperation({ summary: "ID bo'yicha bronni yangilash" })
  @ApiResponse({ status: 200, description: 'Bron muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 404, description: 'Bron topilmadi.' })
  update(@Param('id') id: string, @Body() updateBronDto: UpdateBronDto) {
    return this.bronService.update(+id, updateBronDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // O'chirish metodiga AdminGuardni qo'llash
  @ApiOperation({ summary: "ID bo'yicha bronni o'chirish" })
  @ApiResponse({ status: 200, description: "Bron muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: 'Bron topilmadi.' })
  remove(@Param('id') id: string) {
    return this.bronService.remove(+id);
  }
}
