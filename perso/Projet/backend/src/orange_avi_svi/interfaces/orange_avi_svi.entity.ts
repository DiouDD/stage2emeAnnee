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

  @Column({
    name: 'menu_0_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_0_action!: string | null;

  @Column({ name: 'menu_0_ch', type: 'varchar', length: 50, nullable: true })
  menu_0_ch!: string | null;

  @Column({
    name: 'menu_1_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_1_action!: string | null;

  @Column({ name: 'menu_1_ch', type: 'varchar', length: 50, nullable: true })
  menu_1_ch!: string | null;

  @Column({
    name: 'menu_2_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_2_action!: string | null;

  @Column({ name: 'menu_2_ch', type: 'varchar', length: 50, nullable: true })
  menu_2_ch!: string | null;

  @Column({
    name: 'menu_3_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_3_action!: string | null;

  @Column({ name: 'menu_3_ch', type: 'varchar', length: 50, nullable: true })
  menu_3_ch!: string | null;

  @Column({
    name: 'menu_4_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_4_action!: string | null;

  @Column({ name: 'menu_4_ch', type: 'varchar', length: 50, nullable: true })
  menu_4_ch!: string | null;

  @Column({
    name: 'menu_5_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_5_action!: string | null;

  @Column({ name: 'menu_5_ch', type: 'varchar', length: 50, nullable: true })
  menu_5_ch!: string | null;

  @Column({
    name: 'menu_diese_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_diese_action!: string | null;

  @Column({
    name: 'menu_diese_ch',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_diese_ch!: string | null;

  @Column({
    name: 'menu_etoile_action',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_etoile_action!: string | null;

  @Column({
    name: 'menu_etoile_ch',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  menu_etoile_ch!: string | null;

  @Column({ name: 'audio_svi', type: 'varchar', length: 50, nullable: true })
  audio_svi!: string | null;
}
