import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth, // Import ApiBearerAuth
} from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/AdminGuard';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Post()
  @ApiOperation({ summary: 'Yangi region yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Yangi region muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({ status: 400, description: "Noto'g'ri ma'lumotlar." })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha regionlarni olish' })
  @ApiResponse({ status: 200, description: 'Regionlar muvaffaqiyatli olindi.' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: "Region nomi bo'yicha qidirish",
  })
  findAll(@Query('name') name?: string) {
    return this.regionService.findAll(name);
  }

  @Get(':id')
  @ApiOperation({ summary: "Regionni ID bo'yicha olish" })
  @ApiResponse({ status: 200, description: 'Region muvaffaqiyatli olindi.' })
  @ApiResponse({ status: 404, description: 'Region topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Put(':id')
  @ApiOperation({ summary: 'Regionni yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Region muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 404, description: 'Region topilmadi.' })
  @ApiResponse({ status: 400, description: "Noto'g'ri ma'lumotlar." })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Delete(':id')
  @ApiOperation({ summary: "Regionni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Region muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Region topilmadi.' })
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
