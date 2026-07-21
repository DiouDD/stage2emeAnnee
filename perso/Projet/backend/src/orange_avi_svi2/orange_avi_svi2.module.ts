import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviSvi2Controller } from './orange_avi_svi2.controller';
import { OrangeAviSvi2Service } from './orange_avi_svi2.service';
import { OrangeAviSvi2 } from './interfaces/orange_avi_svi2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviSvi2])],
  controllers: [OrangeAviSvi2Controller],
  providers: [OrangeAviSvi2Service],
  exports: [OrangeAviSvi2Service],
})
export class OrangeAviSvi2Module {}
