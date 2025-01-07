import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, // Import Query for query parameters
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('admin') // Tag for grouping admin-related routes in Swagger
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin' }) // Description of the operation
  @ApiResponse({
    status: 201,
    description: 'Admin successfully created',
    type: User, // Replace with the appropriate response DTO if necessary
  })
  @ApiResponse({
    status: 409,
    description: 'Admin already exists',
  })
  create(@Body() createAdminDto: AddAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all admins' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of admins per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter admins',
  })
  @ApiResponse({
    status: 200,
    description: 'List of admins',
    type: [User], // Array of user objects
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin details',
    type: User, // Replace with the appropriate response DTO if necessary
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use by another admin',
  })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
