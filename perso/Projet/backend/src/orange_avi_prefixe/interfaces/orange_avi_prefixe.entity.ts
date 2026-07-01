import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrangeAviProfile } from 'src/orange_avi_profile/interfaces/orange_avi_profile.entity';

@Entity({ name: 'orange_avi_prefixe' }) // Nom de la table dans MySQL
export class OrangeAviPrefixe {
  @PrimaryGeneratedColumn({ name: 'uid' })
  uid!: number;

  @ManyToOne(() => OrangeAviProfile, (profile) => profile.prefixes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'profile_uid' })
  profile!: OrangeAviProfile;

  @Column({ name: 'dnis', length: 50 })
  dnis!: string;

  @Column({ name: 'sda', length: 50 })
  sda!: string;

  @Column({ name: 'campagne', length: 100 })
  campagne!: string;

  @Column({ name: 'code_campagne' })
  code_campagne!: number;

  @Column({ name: 'customer', length: 10 })
  customer!: string;
}
