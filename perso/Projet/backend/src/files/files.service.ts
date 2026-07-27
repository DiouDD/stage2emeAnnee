import { Injectable } from '@nestjs/common';
import { FilesCacheService } from '../schedule/files-cache.service';

@Injectable()
export class FilesService {
  constructor(private readonly filesCacheService: FilesCacheService) {}

  async findAllPaths(): Promise<string[]> {
    return this.filesCacheService.getAllPaths();
  }
}
