// orange_avi_profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrangeAviPrefixe } from 'src/orange_avi_prefixe/interfaces/orange_avi_prefixe.entity';
import { OrangeAviTimes } from 'src/orange_avi_times/interfaces/orange_avi_times.entity';
import { OrangeAviSvi } from 'src/orange_avi_svi/interfaces/orange_avi_svi.entity';
import { OrangeAviSvi2 } from 'src/orange_avi_svi2/interfaces/orange_avi_svi2.entity';

@Entity({ name: 'orange_avi_profile' })
export class OrangeAviProfile {
  @PrimaryGeneratedColumn({ name: 'uid' })
  uid!: number;

  @OneToMany(() => OrangeAviPrefixe, (prefixe) => prefixe.profile)
  prefixes!: OrangeAviPrefixe[];

  @OneToMany(() => OrangeAviTimes, (time) => time.profile)
  times!: OrangeAviTimes[];

  @OneToMany(() => OrangeAviSvi, (svi) => svi.profile)
  svis!: OrangeAviSvi[];

  @OneToMany(() => OrangeAviSvi2, (svi) => svi.profile)
  svis2!: OrangeAviSvi2[];

  @Column({ name: 'profile', length: 50 })
  profile!: string;

  @Column({ name: 'description', length: 200, nullable: true })
  description!: string;

  @Column({ name: 'waiting_time', nullable: true })
  waiting_time!: number;

  @Column({ name: 'audio_welcome', length: 50, nullable: true })
  audio_welcome!: string;

  @Column({ name: 'audio_waiting', length: 50, nullable: true })
  audio_waiting!: string;

  @Column({ name: 'audio_dissuasion', length: 50, nullable: true })
  audio_dissuasion!: string;

  @Column({ name: 'audio_closing', length: 50, nullable: true })
  audio_closing!: string;

  @Column({ name: 'audio_flash', length: 50, nullable: true })
  audio_flash!: string;

  @Column({ name: 'audio_exceptionnel', length: 50, nullable: true })
  audio_exceptionnel!: string;

  @Column({ name: 'type_dissuasion', length: 100, nullable: true })
  type_dissuasion!: string;

  @Column({ name: 'ch1_dissuasion', length: 100, nullable: true })
  ch1_dissuasion!: string;

  @Column({ name: 'menu_actif', nullable: true })
  menu_actif!: number;

  @Column({ name: 'barrage_entrant', length: 100, nullable: true })
  barrage_entrant!: string;
}
