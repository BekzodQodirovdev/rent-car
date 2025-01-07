import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Region } from '../region/entities/region.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
  ) {}
  async create(addDistrictDto: CreateDistrictDto) {
    const existingDistrict = await this.districtRepo.findOneBy({
      name: addDistrictDto.name,
    });

    if (existingDistrict)
      throw new ConflictException('Bu tuman allaqachon mavjud!');

    const region = await this.regionRepo.findOneBy({
      id: addDistrictDto.region,
    });

    if (!region) throw new NotFoundException('Region topilmadi!');

    const newDistrict = this.districtRepo.create({
      name: addDistrictDto.name,
      region,
    });
    const data = await this.districtRepo.save(newDistrict);

    return { message: 'Yangi tuman yaratildi!', data };
  }

  findAll(name?: string) {
    const where: FindOptionsWhere<District> = {};

    if (name) where.name = Like(`%${name}%`);

    return this.districtRepo.find({ where, relations: ['region'] });
  }

  async findOne(id: number) {
    const district = await this.districtRepo.findOne({
      where: { id },
      relations: ['region'], // Include the region relation
    });
    if (!district) {
      throw new NotFoundException('Bunday tuman topilmadi!'); // Adjusted condition
    }
    return district;
  }

  async update(id: number, updDistrictDto: UpdateDistrictDto) {
    const district = await this.districtRepo.findOneBy({ id });

    if (!district) throw new NotFoundException('Bunday tuman topilmadi!');

    if (updDistrictDto.name) {
      const existingDistrict = await this.districtRepo.findOneBy({
        name: updDistrictDto.name,
      });

      if (existingDistrict && existingDistrict.id !== id)
        throw new ConflictException('Bunday tuman nomi allaqachon mavjud!');

      district.name = updDistrictDto.name;
    }

    if (updDistrictDto.regionId) {
      const region = await this.regionRepo.findOneBy({
        id: updDistrictDto.regionId,
      });

      if (!region) throw new NotFoundException('Bunday region topilmadi!');

      district.region = region;
    }

    await this.districtRepo.save(district);

    return district;
  }

  async remove(id: number) {
    const district = await this.districtRepo.findOneBy({ id });
    if (!district) throw new NotFoundException('Bunday tuman topilmadi!');

    await this.districtRepo.delete(id);

    return { message: 'Tuman o`chirildi!' };
  }
}
