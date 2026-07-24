import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviProfileController } from './orange_avi_profile.controller';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import { OrangeAviTimes } from 'src/orange_avi_times/interfaces/orange_avi_times.entity';
import { OrangeAviSvi } from 'src/orange_avi_svi/interfaces/orange_avi_svi.entity';
import { OrangeAviSvi2 } from 'src/orange_avi_svi2/interfaces/orange_avi_svi2.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrangeAviProfile,
      OrangeAviTimes,
      OrangeAviSvi,
      OrangeAviSvi2,
    ]),
  ],
  controllers: [OrangeAviProfileController],
  providers: [OrangeAviProfileService],
  exports: [OrangeAviProfileService],
})
export class OrangeAviProfileModule {}
