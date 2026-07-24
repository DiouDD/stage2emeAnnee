import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrangeAviProfile } from 'src/orange_avi_profile/interfaces/orange_avi_profile.entity';

/**
 * Entité TypeORM représentant un préfixe/DNIS de campagne Orange AVI (table `orange_avi_prefixe`).
 * Chaque préfixe peut être lié à un {@link OrangeAviProfile} (relation `profile`, colonne FK
 * `profile_uid`) qui détermine le routage/les annonces appliqués à cet appel entrant.
 * La suppression du profil associé délie automatiquement le préfixe (`onDelete: 'SET NULL'`)
 * plutôt que de le supprimer.
 */
@Entity({ name: 'orange_avi_prefixe' }) // Nom de la table dans MySQL
export class OrangeAviPrefixe {
  /** Identifiant unique (clé primaire auto-générée). */
  @PrimaryGeneratedColumn({ name: 'uid' })
  uid!: number;

  /** Profil Orange AVI associé (optionnel) ; `null` si aucun profil n'est lié. */
  @ManyToOne(() => OrangeAviProfile, (profile) => profile.prefixes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'profile_uid' })
  profile!: OrangeAviProfile;

  /** Numéro appelé (DNIS). */
  @Column({ name: 'dnis', length: 50 })
  dnis!: string;

  /** Numéro SDA associé. */
  @Column({ name: 'sda', length: 50 })
  sda!: string;

  /** Nom de la campagne. */
  @Column({ name: 'campagne', length: 100 })
  campagne!: string;

  /** Code numérique identifiant la campagne. */
  @Column({ name: 'code_campagne' })
  code_campagne!: number;

  /** Identifiant/code du client. */
  @Column({ name: 'customer', length: 10 })
  customer!: string;
}
