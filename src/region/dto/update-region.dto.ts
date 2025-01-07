import { IsOptional, IsString } from 'class-validator';

export class UpdateRegionDto {
  @IsString({ message: 'String ko`rinishida bo`lishi kerak!' })
  @IsOptional()
  name?: string;
}
