// orange_avi_prefixe.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrangeAviPrefixe } from './interfaces/orange_avi_prefixe.entity';
import { OrangeAviProfile } from 'src/orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  CreateOrangeAviPrefixeDto,
  UpdateOrangeAviPrefixeDto,
} from './schemas/orange_avi_prefixe.schema';

@Injectable()
export class OrangeAviPrefixeService {
  constructor(
    @InjectRepository(OrangeAviPrefixe)
    private readonly oapRepository: Repository<OrangeAviPrefixe>,
  ) {}

  async findAll(): Promise<OrangeAviPrefixe[]> {
    const result = await this.oapRepository.find({
      relations: {
        profile: true,
      },
    });
    console.log('Données brutes reçues de MySQL :', result);
    return result;
  }

  async findOne(uid: number): Promise<OrangeAviPrefixe | null> {
    const result = await this.oapRepository.findOne({
      where: { uid: uid },
      relations: {
        profile: true,
      },
    });
    console.log('Données brutes reçues de MySQL :', result);
    return result;
  }

  async create(oap: CreateOrangeAviPrefixeDto): Promise<OrangeAviPrefixe> {
    const oaps = await this.oapRepository.find();
    const newId = oaps.length > 0 ? Math.max(...oaps.map((c) => c.uid)) + 1 : 1;
    // Extraction de profileUid s'il existe (déjà validé par Zod)
    const { profileUid, ...rest } = oap;
    const newOrange_avi_prefixe = this.oapRepository.create({
      uid: newId,
      ...rest,
    });

    // Si un identifiant de profil est fourni, on fait le lien
    if (profileUid) {
      newOrange_avi_prefixe.profile = { uid: profileUid } as OrangeAviProfile;
    }

    await this.oapRepository.save(newOrange_avi_prefixe);
    return this.findOne(newOrange_avi_prefixe.uid) as Promise<OrangeAviPrefixe>;
  }

  async update(
    uid: number,
    updatedFields: UpdateOrangeAviPrefixeDto,
  ): Promise<OrangeAviPrefixe | null> {
    await this.findOne(uid);
    const { profileUid, ...rest } = updatedFields;
    // On type proprement l'objet partiel pour satisfaire ESLint et éviter le type 'any'
    const updateData: Partial<Omit<OrangeAviPrefixe, 'profile'>> & {
      profile?: OrangeAviProfile | null;
    } = { ...rest };
    if (profileUid !== undefined) {
      updateData.profile = profileUid
        ? ({ uid: profileUid } as OrangeAviProfile)
        : null;
    }

    // save() appliquera la mise à jour de l'entité et de sa relation
    await this.oapRepository.save({ uid, ...updateData } as any);
    return this.findOne(uid);
  }

  async delete(uid: number): Promise<void> {
    const oapToDelete = await this.findOne(uid);
    if (oapToDelete === null) {
      throw new Error(`OrangeAviPrefixe with uid ${uid} not found.`);
    }
    await this.oapRepository.remove(oapToDelete);
  }
}
