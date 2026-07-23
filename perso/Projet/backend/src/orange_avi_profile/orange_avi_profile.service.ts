import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import { OrangeAviTimes } from 'src/orange_avi_times/interfaces/orange_avi_times.entity';
import {
  CreateOrangeAviProfileDto,
  UpdateOrangeAviProfileDto,
} from './schemas/orange_avi_profile.schema';

@Injectable()
export class OrangeAviProfileService {
  constructor(
    @InjectRepository(OrangeAviProfile)
    private readonly oapRepository: Repository<OrangeAviProfile>,
    @InjectRepository(OrangeAviTimes)
    private readonly oatRepository: Repository<OrangeAviTimes>,
  ) {}

  async findAll(): Promise<OrangeAviProfile[]> {
    return this.oapRepository.find();
  }

  async findOne(uid: number): Promise<OrangeAviProfile | null> {
    return this.oapRepository.findOneBy({ uid });
  }

  async create(oap: CreateOrangeAviProfileDto): Promise<OrangeAviProfile> {
    const newOrangeAviProfile = this.oapRepository.create(oap);

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

  /**
   * Duplique un profil (nom + "_copy") ainsi que tous ses horaires en une
   * seule opération côté serveur, plutôt que de multiplier les allers-retours HTTP.
   */
  async duplicate(uid: number): Promise<OrangeAviProfile> {
    const original = await this.oapRepository.findOne({
      where: { uid },
      relations: { times: true },
    });
    if (original === null) {
      throw new NotFoundException(`OrangeAviProfile with uid ${uid} not found.`);
    }

    const { uid: _uid, times, prefixes, svis, svis2, ...rest } = original;

    const newProfile = this.oapRepository.create({
      ...rest,
      profile: `${original.profile}_copy`,
    });
    await this.oapRepository.save(newProfile);

    if (times?.length) {
      const newTimes = times.map((time) =>
        this.oatRepository.create({
          day: time.day,
          dow: time.dow,
          opening_time: time.opening_time,
          closing_time: time.closing_time,
          profile: newProfile,
        }),
      );
      await this.oatRepository.save(newTimes);
    }

    return this.findOne(newProfile.uid) as Promise<OrangeAviProfile>;
  }
}
