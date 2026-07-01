import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviProfileController } from './orange_avi_profile.controller';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviProfile])],
  controllers: [OrangeAviProfileController],
  providers: [OrangeAviProfileService],
  exports: [OrangeAviProfileService],
})
export class OrangeAviProfileModule {}
