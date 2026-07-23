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
import { OrangeAviSvi } from './orange_avi_svi/interfaces/orange_avi_svi.entity';
import { OrangeAviSviModule } from './orange_avi_svi/orange_avi_svi.module';
import { OrangeAviSvi2 } from './orange_avi_svi2/interfaces/orange_avi_svi2.entity';
import { OrangeAviSvi2Module } from './orange_avi_svi2/orange_avi_svi2.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'changeme',
      database: 'orange_db',
      entities: [
        OrangeAviPrefixe,
        OrangeAviProfile,
        OrangeAviTimes,
        OrangeAviSvi,
        OrangeAviSvi2,
      ], // Ajoutez votre entité ici aussi si vous n'utilisez pas d'auto-load
      synchronize: true, // /!\ À désactiver en production, pratique en développement
    }),
    OrangeAviPrefixeModule,
    OrangeAviProfileModule,
    OrangeAviTimesModule,
    OrangeAviSviModule,
    OrangeAviSvi2Module,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
