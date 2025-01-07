import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Headers,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from '../common/guards/UserGuard';

@ApiTags('Izohlar') // Grouping the routes under 'Izohlar'
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Izoh muvaffaqiyatli yaratildi',
    type: Comment,
  })
  @ApiResponse({
    status: 404,
    description: 'Foydalanuvchi yoki mashina topilmadi',
  })
  @ApiResponse({
    status: 401,
    description: 'Token not provided or invalid',
  })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('Authorization') token: string,
  ) {
    return this.commentService.create(createCommentDto, token);
  }
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Barcha izohlar muvaffaqiyatli qaytarildi',
    type: Comment,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Izohlar topilmadi',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Qaytariladigan sahifa raqami',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Bir sahifada qaytariladigan izohlar soni',
    type: Number,
    example: 10,
  })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.commentService.findAll(page, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Izoh muvaffaqiyatli qaytarildi',
    type: Comment,
  })
  @ApiResponse({
    status: 404,
    description: 'Bu izoh topilmadi',
  })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Izoh muvaffaqiyatli yangilandi',
    type: Comment,
  })
  @ApiResponse({
    status: 404,
    description: 'Izoh topilmadi',
  })
  @ApiResponse({
    status: 401,
    description: 'Token not provided or invalid',
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Headers('Authorization') token: string,
  ) {
    return this.commentService.update(+id, updateCommentDto, token);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: "Izoh muvaffaqiyatli o'chirildi",
  })
  @ApiResponse({
    status: 404,
    description: 'Izoh topilmadi',
  })
  @ApiResponse({
    status: 401,
    description: 'Token not provided or invalid',
  })
  remove(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.commentService.remove(+id, token);
  }
}
