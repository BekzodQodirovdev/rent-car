// create-district.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({ description: 'The name of the district' })
  @IsString({ message: 'String ko`rinishida bo`lishi kerak!' })
  @IsNotEmpty({ message: 'Bo`sh bo`lmasligi kerak!' })
  name: string;

  @ApiProperty({ description: 'The ID of the region the district belongs to' })
  @IsInt({ message: 'Region ID must be an integer' })
  @IsNotEmpty({ message: 'Bo`sh bo`lmasligi kerak!' })
  region: number;
}
