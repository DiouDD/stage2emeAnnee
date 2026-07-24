import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import { OrangeAviTimes } from 'src/orange_avi_times/interfaces/orange_avi_times.entity';
import { OrangeAviSvi } from 'src/orange_avi_svi/interfaces/orange_avi_svi.entity';
import { OrangeAviSvi2 } from 'src/orange_avi_svi2/interfaces/orange_avi_svi2.entity';
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
    @InjectRepository(OrangeAviSvi)
    private readonly oasRepository: Repository<OrangeAviSvi>,
    @InjectRepository(OrangeAviSvi2)
    private readonly oas2Repository: Repository<OrangeAviSvi2>,
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

    const svisToDelete = await this.oasRepository.find({
      where: { profile: { uid } },
      relations: { profile: true },
    });
    if (svisToDelete.length) {
      await this.oasRepository.remove(svisToDelete);
    }

    const svis2ToDelete = await this.oas2Repository.find({
      where: { profile: { uid } },
      relations: { profile: true },
    });
    if (svis2ToDelete.length) {
      await this.oas2Repository.remove(svis2ToDelete);
    }

    await this.oapRepository.remove(oapToDelete);
  }

  /**
   * Duplique un profil (nom + "_copy") ainsi que tous ses horaires et SVI en
   * une seule opération côté serveur, plutôt que de multiplier les allers-retours HTTP.
   */
  async duplicate(uid: number): Promise<OrangeAviProfile> {
    const original = await this.oapRepository.findOne({
      where: { uid },
      relations: { times: true, svis: true, svis2: true },
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

    if (svis?.length) {
      const newSvis = svis.map(({ uid: _sviUid, profile: _profile, ...sviRest }) =>
        this.oasRepository.create({
          ...sviRest,
          profile: newProfile,
        }),
      );
      await this.oasRepository.save(newSvis);
    }

    if (svis2?.length) {
      const newSvis2 = svis2.map(({ uid: _sviUid, profile: _profile, ...sviRest }) =>
        this.oas2Repository.create({
          ...sviRest,
          profile: newProfile,
        }),
      );
      await this.oas2Repository.save(newSvis2);
    }

    return this.findOne(newProfile.uid) as Promise<OrangeAviProfile>;
  }
}
