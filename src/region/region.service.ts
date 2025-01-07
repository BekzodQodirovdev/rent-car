import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) private regionRepo: Repository<Region>,
  ) {}
  async create(addRegDto: CreateRegionDto) {
    const region = await this.regionRepo.findOneBy({ name: addRegDto.name });
    if (region) throw new ConflictException('Bu region allaqachon mavjud!');
    const newRegion = this.regionRepo.create(addRegDto);
    const data = this.regionRepo.save(newRegion);
    return { message: 'Yangi region qo`shildi!', data };
  }

  findAll(name?: string) {
    const where: FindOptionsWhere<Region> = {};

    if (name) where.name = Like(`%${name}%`);

    return this.regionRepo.find({ where });
  }

  async findOne(id: number) {
    const region = await this.regionRepo.findOneBy({ id });
    if (!region) throw new NotFoundException('Bunday region topilmadi!');
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.regionRepo.findOneBy({ id });

    if (!region) throw new NotFoundException('Bunday region topilmadi!');
    if (updateRegionDto.name) region.name = updateRegionDto.name;

    await this.regionRepo.save(region);

    return region;
  }

  remove(id: number) {
    return `This action removes a #${id} region`;
  }
}
