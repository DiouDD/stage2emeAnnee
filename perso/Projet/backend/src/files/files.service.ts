import { Injectable } from '@nestjs/common';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

@Injectable()
export class FilesService {
  private readonly filesRoot = join(process.cwd(), '..', 'files');

  async findAllPaths(): Promise<string[]> {
    const paths = await this.walk(this.filesRoot);
    return paths
      .map((path) => relative(this.filesRoot, path).split('\\').join('/'))
      .sort();
  }

  private async walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const paths = await Promise.all(
      entries.map((entry) => {
        const fullPath = join(dir, entry.name);
        return entry.isDirectory()
          ? this.walk(fullPath)
          : Promise.resolve([fullPath]);
      }),
    );
    return paths.flat();
  }
}
