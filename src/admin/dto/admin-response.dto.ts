// src/admin/dto/admin-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ description: 'id of the admin' })
  id: number;
  @ApiProperty({ description: 'First name of the admin' })
  fname: string;

  @ApiProperty({ description: 'Email address of the admin' })
  email: string;

  @ApiProperty({ description: 'Admin status' })
  admin: boolean;
  @ApiProperty({ description: 'Main admin status' })
  is_super: boolean;
}
