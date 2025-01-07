import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth, // Import ApiBearerAuth
} from '@nestjs/swagger';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { AdminGuard } from '../common/guards/AdminGuard';

@ApiTags('District') // Swagger tag for grouping
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Post()
  @ApiOperation({ summary: 'Yangi tuman yaratish' })
  @ApiResponse({ status: 201, description: 'Tuman muvaffaqiyatli yaratildi.' })
  @ApiBody({ type: CreateDistrictDto })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha tumanlarni olish' })
  @ApiResponse({ status: 200, description: 'Tumanlar muvaffaqiyatli olindi.' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: "Tuman nomi bo'yicha qidirish",
  }) // Added this line for query parameter documentation
  findAll(@Query('name') name?: string) {
    return this.districtService.findAll(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta tumanni olish' })
  @ApiResponse({ status: 200, description: 'Tuman muvaffaqiyatli olindi.' })
  @ApiParam({ name: 'id', description: 'Tuman ID raqami' })
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Put(':id')
  @ApiOperation({ summary: 'Tumanni yangilash' })
  @ApiResponse({ status: 200, description: 'Tuman muvaffaqiyatli yangilandi.' })
  @ApiParam({
    name: 'id',
    description: "Yangilanishi kerak bo'lgan tuman ID raqami",
  })
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth() // Add Bearer Auth to this endpoint
  @Delete(':id')
  @ApiOperation({ summary: "Tumanni o'chirish" })
  @ApiResponse({ status: 200, description: "Tuman muvaffaqiyatli o'chirildi." })
  @ApiParam({
    name: 'id',
    description: "O'chirilishi kerak bo'lgan tuman ID raqami",
  })
  remove(@Param('id') id: string) {
    return this.districtService.remove(+id);
  }
}
