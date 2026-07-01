import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

/**
 * Pipe générique : à utiliser avec @UsePipes(new ZodValidationPipe(monSchema))
 * sur n'importe quel endpoint / n'importe quel module du projet.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(this.formatErrors(result.error));
    }

    // On retourne la donnée "parsed" par Zod (types coercés, defaults appliqués, etc.)
    return result.data;
  }

  private formatErrors(error: ZodError) {
    return {
      message: 'Validation échouée',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }
}
