import { OrangeAviProfile } from 'src/orange_avi_profile/interfaces/orange_avi_profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'orange_avi_times' })
export class OrangeAviTimes {
  @PrimaryGeneratedColumn({ name: 'uid' })
  uid!: number;

  @ManyToOne(() => OrangeAviProfile, (profile) => profile.times, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'id_profile' })
  profile!: OrangeAviProfile;

  @Column({ name: 'day', nullable: true })
  day!: Date;

  @Column({ name: 'dow', nullable: true })
  dow!: number;

  @Column({ name: 'opening_time', length: 8 })
  opening_time!: string;

  @Column({ name: 'closing_time', length: 8 })
  closing_time!: string;
}
