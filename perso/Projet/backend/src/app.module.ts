import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrangeAviPrefixeModule } from './orange_avi_prefixe/orange_avi_prefixe.module';
import { OrangeAviPrefixe } from './orange_avi_prefixe/interfaces/orange_avi_prefixe.entity';
import { OrangeAviProfile } from './orange_avi_profile/interfaces/orange_avi_profile.entity';
import { OrangeAviProfileModule } from './orange_avi_profile/orange_avi_profile.module';
import { OrangeAviTimes } from './orange_avi_times/interfaces/orange_avi_times.entity';
import { OrangeAviTimesModule } from './orange_avi_times/orange_avi_times.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'changeme',
      database: 'orange_db',
      entities: [OrangeAviPrefixe, OrangeAviProfile, OrangeAviTimes], // Ajoutez votre entité ici aussi si vous n'utilisez pas d'auto-load
      synchronize: true, // /!\ À désactiver en production, pratique en développement
    }),
    OrangeAviPrefixeModule,
    OrangeAviProfileModule,
    OrangeAviTimesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
