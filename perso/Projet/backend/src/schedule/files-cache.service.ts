import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

@Injectable()
export class FilesCacheService implements OnModuleInit {
  private static readonly CACHE_KEY = 'files:all-paths';
  private readonly logger = new Logger(FilesCacheService.name);
  private readonly filesRoot = join(process.cwd(), '..', 'files');

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  @Cron('* * 2 * * *')
  async refresh(): Promise<string[]> {
    const paths = await this.walk(this.filesRoot);
    const relativePaths = paths
      .map((path) => relative(this.filesRoot, path).split('\\').join('/'))
      .sort();

    await this.cacheManager.set(FilesCacheService.CACHE_KEY, relativePaths);
    this.logger.log(`Cache des fichiers mis à jour (${relativePaths.length} fichiers)`);
    return relativePaths;
  }

  async getAllPaths(): Promise<string[]> {
    const cached = await this.cacheManager.get<string[]>(FilesCacheService.CACHE_KEY);
    if (cached) return cached;
    return this.refresh();
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
