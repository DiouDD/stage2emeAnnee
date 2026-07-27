import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { FilesCacheService } from './files-cache.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 1000, // 2 heures
    }),
    NestScheduleModule.forRoot(),
  ],
  providers: [FilesCacheService],
  exports: [FilesCacheService],
})
export class ScheduleModule {}
