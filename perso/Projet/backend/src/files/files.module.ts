import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10 * 60 * 1000, // 10 minutes
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
