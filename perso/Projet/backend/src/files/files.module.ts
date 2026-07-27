import { Module } from '@nestjs/common';
import { ScheduleModule } from '../schedule/schedule.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ScheduleModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
