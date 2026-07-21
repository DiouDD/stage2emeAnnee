import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviSvi2 } from './interfaces/orange_avi_svi2.entity';
import { OrangeAviProfile } from '../orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  CreateOrangeAviSvi2Dto,
  UpdateOrangeAviSvi2Dto,
} from './schemas/orange_avi_svi2.schema';

@Injectable()
export class OrangeAviSvi2Service {
  constructor(
    @InjectRepository(OrangeAviSvi2)
    private readonly oasRepository: Repository<OrangeAviSvi2>,
  ) {}

  async findAll(): Promise<OrangeAviSvi2[]> {
    return this.oasRepository.find({ relations: { profile: true } });
  }

  async findOne(uid: number): Promise<OrangeAviSvi2 | null> {
    return this.oasRepository.findOne({
      where: { uid },
      relations: { profile: true },
    });
  }

  async findByProfile(profileUid: number): Promise<OrangeAviSvi2[]> {
    return this.oasRepository.find({
      where: { profile: { uid: profileUid } },
      relations: { profile: true },
    });
  }

  async create(oas: CreateOrangeAviSvi2Dto): Promise<OrangeAviSvi2> {
    const { profileUid, ...rest } = oas;
    const newSvi = this.oasRepository.create({
      ...rest,
      profile: { uid: profileUid } as OrangeAviProfile,
    });

    await this.oasRepository.save(newSvi);
    return this.findOne(newSvi.uid) as Promise<OrangeAviSvi2>;
  }

  async update(
    uid: number,
    updatedFields: UpdateOrangeAviSvi2Dto,
  ): Promise<OrangeAviSvi2 | null> {
    const { profileUid, ...rest } = updatedFields;
    const updateData: Partial<Omit<OrangeAviSvi2, 'profile'>> & {
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
      throw new Error(`OrangeAviSvi2 with uid ${uid} not found.`);
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
