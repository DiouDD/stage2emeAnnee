import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviPrefixeController } from './orange_avi_prefixe.controller';
import { OrangeAviPrefixeService } from './orange_avi_prefixe.service';
import { OrangeAviPrefixe } from './interfaces/orange_avi_prefixe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviPrefixe])],
  controllers: [OrangeAviPrefixeController],
  providers: [OrangeAviPrefixeService],
  exports: [OrangeAviPrefixeService],
})
export class OrangeAviPrefixeModule {}
