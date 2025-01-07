import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsString({ message: 'String ko`rinishida bo`lishi kerak!' })
  @IsNotEmpty({ message: 'Bo`sh bo`lmasligi kerak!' })
  name: string;
}
