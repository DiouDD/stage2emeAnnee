import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async findAll(): Promise<string[]> {
    console.log('[API] GET /files');
    const result = await this.filesService.findAllPaths();
    console.log('[API] GET /files -> réponse:', result);
    return result;
  }
}
