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

/**
 * Logique métier de la ressource `orange_avi_prefixe` (CRUD + liaison à un profil).
 * Consommé par {@link OrangeAviPrefixeController}.
 */
@Injectable()
export class OrangeAviPrefixeService {
  constructor(
    @InjectRepository(OrangeAviPrefixe)
    private readonly oapRepository: Repository<OrangeAviPrefixe>,
  ) {}

  /** Récupère tous les préfixes, avec leur profil associé (relation `profile`) chargé. */
  async findAll(): Promise<OrangeAviPrefixe[]> {
    const result = await this.oapRepository.find({
      relations: {
        profile: true,
      },
    });
    console.log('Données brutes reçues de MySQL :', result);
    return result;
  }

  /** Récupère un préfixe par son uid, avec son profil associé (relation `profile`) chargé. */
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

  /**
   * Crée un nouveau préfixe. L'uid est calculé manuellement (max des uids existants + 1)
   * plutôt que délégué à l'auto-increment MySQL. Si `profileUid` est fourni, le préfixe
   * est immédiatement lié au profil correspondant.
   */
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

  /**
   * Met à jour un préfixe existant. `profileUid` peut valoir :
   * - `undefined` : le lien vers le profil n'est pas modifié ;
   * - un nombre : le préfixe est lié à ce profil ;
   * - `null` : le préfixe est délié de tout profil.
   */
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

  /**
   * Supprime un préfixe par son uid.
   * @throws Error si aucun préfixe ne correspond à cet uid.
   */
  async delete(uid: number): Promise<void> {
    const oapToDelete = await this.findOne(uid);
    if (oapToDelete === null) {
      throw new Error(`OrangeAviPrefixe with uid ${uid} not found.`);
    }
    await this.oapRepository.remove(oapToDelete);
  }
}
