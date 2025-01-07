import { ApiProperty } from '@nestjs/swagger';

export class photoUpload {
  @ApiProperty({ description: 'car images', type: 'string', format: 'binary' })
  photo?: any;
}
