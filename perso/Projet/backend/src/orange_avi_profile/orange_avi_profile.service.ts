import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import {
  CreateOrangeAviProfileDto,
  UpdateOrangeAviProfileDto,
} from './schemas/orange_avi_profile.schema';

@Injectable()
export class OrangeAviProfileService {
  constructor(
    @InjectRepository(OrangeAviProfile)
    private readonly oapRepository: Repository<OrangeAviProfile>,
  ) {}

  async findAll(): Promise<OrangeAviProfile[]> {
    return this.oapRepository.find();
  }

  async findOne(uid: number): Promise<OrangeAviProfile | null> {
    return this.oapRepository.findOneBy({ uid });
  }

  async create(oap: CreateOrangeAviProfileDto): Promise<OrangeAviProfile> {
    const oaps = await this.oapRepository.find();
    const newId = oaps.length > 0 ? Math.max(...oaps.map((c) => c.uid)) + 1 : 1;
    const newOrangeAviProfile = this.oapRepository.create({
      uid: newId,
      ...oap,
    });

    await this.oapRepository.save(newOrangeAviProfile);
    return newOrangeAviProfile;
  }

  async update(
    uid: number,
    updatedFields: UpdateOrangeAviProfileDto,
  ): Promise<OrangeAviProfile | null> {
    await this.findOne(uid);
    await this.oapRepository.update(uid, updatedFields);
    return this.findOne(uid);
  }

  async delete(uid: number): Promise<void> {
    const oapToDelete = await this.findOne(uid);
    if (oapToDelete === null) {
      throw new Error(`OrangeAviProfile with uid ${uid} not found.`);
    }
    await this.oapRepository.remove(oapToDelete);
  }
}
