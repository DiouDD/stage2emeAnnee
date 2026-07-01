import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviTimesController } from './orange_avi_times.controller';
import { OrangeAviTimesService } from './orange_avi_times.service';
import { OrangeAviTimes } from './interfaces/orange_avi_times.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviTimes])],
  controllers: [OrangeAviTimesController],
  providers: [OrangeAviTimesService],
  exports: [OrangeAviTimesService],
})
export class OrangeAviTimesModule {}
