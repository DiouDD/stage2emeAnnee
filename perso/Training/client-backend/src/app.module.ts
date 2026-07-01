import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrangeAviPrefixeModule } from './orange_avi_prefixe/orange_avi_prefixe.module';

@Module({
  imports: [OrangeAviPrefixeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
