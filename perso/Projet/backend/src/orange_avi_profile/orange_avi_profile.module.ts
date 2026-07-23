import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviProfileController } from './orange_avi_profile.controller';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import { OrangeAviTimes } from 'src/orange_avi_times/interfaces/orange_avi_times.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviProfile, OrangeAviTimes])],
  controllers: [OrangeAviProfileController],
  providers: [OrangeAviProfileService],
  exports: [OrangeAviProfileService],
})
export class OrangeAviProfileModule {}
