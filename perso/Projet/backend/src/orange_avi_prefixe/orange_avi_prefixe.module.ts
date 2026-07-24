import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrangeAviPrefixeController } from './orange_avi_prefixe.controller';
import { OrangeAviPrefixeService } from './orange_avi_prefixe.service';
import { OrangeAviPrefixe } from './interfaces/orange_avi_prefixe.entity';

/**
 * Module NestJS de la ressource `orange_avi_prefixe` (route `/oapres`).
 * Expose {@link OrangeAviPrefixeService} pour permettre à d'autres modules
 * (ex: `orange_avi_profile`) d'accéder aux préfixes liés à un profil.
 */
@Module({
  imports: [TypeOrmModule.forFeature([OrangeAviPrefixe])],
  controllers: [OrangeAviPrefixeController],
  providers: [OrangeAviPrefixeService],
  exports: [OrangeAviPrefixeService],
})
export class OrangeAviPrefixeModule {}
