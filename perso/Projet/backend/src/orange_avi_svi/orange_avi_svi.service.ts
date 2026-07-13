import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviSvi } from './interfaces/orange_avi_svi.entity';
import { OrangeAviProfile } from '../orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  CreateOrangeAviSviDto,
  UpdateOrangeAviSviDto,
} from './orange_avi_svi.dto';

@Injectable()
export class OrangeAviSviService {
  constructor(
    @InjectRepository(OrangeAviSvi)
    private readonly oasRepository: Repository<OrangeAviSvi>,
  ) {}

  async findAll(): Promise<OrangeAviSvi[]> {
    return this.oasRepository.find({ relations: { profile: true } });
  }

  async findOne(uid: number): Promise<OrangeAviSvi | null> {
    return this.oasRepository.findOne({
      where: { uid },
      relations: { profile: true },
    });
  }

  async findByProfile(profileUid: number): Promise<OrangeAviSvi[]> {
    return this.oasRepository.find({
      where: { profile: { uid: profileUid } },
      relations: { profile: true },
    });
  }

  async create(oas: CreateOrangeAviSviDto): Promise<OrangeAviSvi> {
    const { profileUid, ...rest } = oas;
    const newSvi = this.oasRepository.create({
      ...rest,
      profile: { uid: profileUid } as OrangeAviProfile,
    });

    await this.oasRepository.save(newSvi);
    return this.findOne(newSvi.uid) as Promise<OrangeAviSvi>;
  }

  async update(
    uid: number,
    updatedFields: UpdateOrangeAviSviDto,
  ): Promise<OrangeAviSvi | null> {
    const { profileUid, ...rest } = updatedFields;
    const updateData: Partial<Omit<OrangeAviSvi, 'profile'>> & {
      profile?: OrangeAviProfile;
    } = { ...rest };

    if (profileUid !== undefined) {
      updateData.profile = { uid: profileUid } as OrangeAviProfile;
    }

    await this.oasRepository.save({ uid, ...updateData } as any);
    return this.findOne(uid);
  }

  async delete(uid: number): Promise<void> {
    const oasToDelete = await this.findOne(uid);
    if (oasToDelete === null) {
      throw new Error(`OrangeAviSvi with uid ${uid} not found.`);
    }
    await this.oasRepository.remove(oasToDelete);
  }

  async deleteByProfile(profileUid: number): Promise<void> {
    const svisToDelete = await this.oasRepository.find({
      where: { profile: { uid: profileUid } },
      relations: { profile: true },
    });
    await this.oasRepository.remove(svisToDelete);
  }
}
