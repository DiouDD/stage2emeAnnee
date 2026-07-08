import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviTimes } from './interfaces/orange_avi_times.entity';
import { OrangeAviProfile } from '../orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  CreateOrangeAviTimesDto,
  UpdateOrangeAviTimesDto,
} from './schemas/orange_avi_times.schema';

@Injectable()
export class OrangeAviTimesService {
  constructor(
    @InjectRepository(OrangeAviTimes)
    private readonly oapRepository: Repository<OrangeAviTimes>,
  ) {}

  async findAll(): Promise<OrangeAviTimes[]> {
    return this.oapRepository.find({ relations: { profile: true } });
  }

  async findOne(uid: number): Promise<OrangeAviTimes | null> {
    return this.oapRepository.findOne({
      where: { uid },
      relations: { profile: true },
    });
  }

  async findByProfile(profileUid: number): Promise<OrangeAviTimes[]> {
    return this.oapRepository.find({
      where: { profile: { uid: profileUid } },
      relations: { profile: true },
    });
  }

  async create(oap: CreateOrangeAviTimesDto): Promise<OrangeAviTimes> {
    const { profileUid, ...rest } = oap;
    const newTime = this.oapRepository.create({
      ...rest,
      ...(profileUid
        ? { profile: { uid: profileUid } as OrangeAviProfile }
        : {}),
    });

    await this.oapRepository.save(newTime);
    return this.findOne(newTime.uid) as Promise<OrangeAviTimes>;
  }

  async update(
    uid: number,
    updatedFields: UpdateOrangeAviTimesDto,
  ): Promise<OrangeAviTimes | null> {
    const { profileUid, ...rest } = updatedFields;
    const updateData: Partial<Omit<OrangeAviTimes, 'profile'>> & {
      profile?: OrangeAviProfile | null;
    } = { ...rest };

    if (profileUid !== undefined) {
      updateData.profile = profileUid
        ? ({ uid: profileUid } as OrangeAviProfile)
        : null;
    }

    await this.oapRepository.save({ uid, ...updateData } as any);
    return this.findOne(uid);
  }

  async delete(uid: number): Promise<void> {
    const oapToDelete = await this.findOne(uid);
    if (oapToDelete === null) {
      throw new Error(`OrangeAviTimes with uid ${uid} not found.`);
    }
    await this.oapRepository.remove(oapToDelete);
  }

  async deleteByProfile(profileUid: number): Promise<void> {
    const timesToDelete = await this.oapRepository.find({
      where: { profile: { uid: profileUid } },
      relations: { profile: true },
    });
    await this.oapRepository.remove(timesToDelete);
  }
}
