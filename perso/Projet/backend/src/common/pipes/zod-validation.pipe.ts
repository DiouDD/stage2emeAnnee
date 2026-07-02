import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata): unknown {
    // Si NestJS applique le pipe sur le @Param ou le @Query au lieu du @Body,
    // la valeur peut être une string (l'ID par exemple). On ne valide le schéma que sur le Body.
    if (metadata.type !== 'body') {
      return value;
    }

    // Sécurité : Si jamais le body est reçu sous forme de string JSON non parsée
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value) as unknown;
      } catch {
        throw new BadRequestException(
          'Le corps de la requête doit être un objet JSON valide',
        );
      }
    }

    // Validation Zod
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation échouée',
        errors: result.error.issues,
      });
    }

    return result.data;
  }
}
