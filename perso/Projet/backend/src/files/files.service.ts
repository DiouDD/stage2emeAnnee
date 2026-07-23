import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

@Injectable()
export class FilesService {
  private readonly filesRoot = join(process.cwd(), '..', 'files');
  private static readonly CACHE_KEY = 'files:all-paths';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async findAllPaths(): Promise<string[]> {
    const cached = await this.cacheManager.get<string[]>(FilesService.CACHE_KEY);
    if (cached) return cached;

    const paths = await this.walk(this.filesRoot);
    const relativePaths = paths
      .map((path) => relative(this.filesRoot, path).split('\\').join('/'))
      .sort();

    await this.cacheManager.set(FilesService.CACHE_KEY, relativePaths);
    return relativePaths;
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
