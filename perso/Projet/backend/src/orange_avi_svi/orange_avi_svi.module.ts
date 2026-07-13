import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviSviController } from './orange_avi_svi.controller';
import { OrangeAviSviService } from './orange_avi_svi.service';
import { OrangeAviSvi } from './interfaces/orange_avi_svi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviSvi])],
  controllers: [OrangeAviSviController],
  providers: [OrangeAviSviService],
  exports: [OrangeAviSviService],
})
export class OrangeAviSviModule {}
