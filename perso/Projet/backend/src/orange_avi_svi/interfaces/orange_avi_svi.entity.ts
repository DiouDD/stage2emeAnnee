import { OrangeAviProfile } from 'src/orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'orange_avi_svi' })
export class OrangeAviSvi {
  @PrimaryGeneratedColumn({ name: 'uid' })
  uid!: number;

  @ManyToOne(() => OrangeAviProfile, (profile) => profile.svis, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'id_profile' })
  profile!: OrangeAviProfile;

  @Column({ name: 'menu_0_action', length: 50, nullable: true })
  menu_0_action!: string;

  @Column({ name: 'menu_0_ch', length: 50, nullable: true })
  menu_0_ch!: string;

  @Column({ name: 'menu_1_action', length: 50, nullable: true })
  menu_1_action!: string;

  @Column({ name: 'menu_1_ch', length: 50, nullable: true })
  menu_1_ch!: string;

  @Column({ name: 'menu_2_action', length: 50, nullable: true })
  menu_2_action!: string;

  @Column({ name: 'menu_2_ch', length: 50, nullable: true })
  menu_2_ch!: string;

  @Column({ name: 'menu_3_action', length: 50, nullable: true })
  menu_3_action!: string;

  @Column({ name: 'menu_3_ch', length: 50, nullable: true })
  menu_3_ch!: string;

  @Column({ name: 'menu_4_action', length: 50, nullable: true })
  menu_4_action!: string;

  @Column({ name: 'menu_4_ch', length: 50, nullable: true })
  menu_4_ch!: string;

  @Column({ name: 'menu_5_action', length: 50, nullable: true })
  menu_5_action!: string;

  @Column({ name: 'menu_5_ch', length: 50, nullable: true })
  menu_5_ch!: string;

  @Column({ name: 'menu_diese_action', length: 50, nullable: true })
  menu_diese_action!: string;

  @Column({ name: 'menu_diese_ch', length: 50, nullable: true })
  menu_diese_ch!: string;

  @Column({ name: 'menu_etoile_action', length: 50, nullable: true })
  menu_etoile_action!: string;

  @Column({ name: 'menu_etoile_ch', length: 50, nullable: true })
  menu_etoile_ch!: string;

  @Column({ name: 'audio_svi', length: 50, nullable: true })
  audio_svi!: string;
}
