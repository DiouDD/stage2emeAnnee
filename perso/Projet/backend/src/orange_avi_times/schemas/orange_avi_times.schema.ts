import { z } from 'zod';

// Schéma de création : reflète les colonnes de l'entité (hors uid, généré par la DB)
// + profileUid, optionnel, pour lier le créneau à un profil au moment de la création.
export const createOrangeAviTimesSchema = z.object({
  day: z.coerce.date().optional(),
  dow: z.coerce
    .number()
    .int('dow doit être un entier')
    .min(1, 'dow doit être compris entre 1 et 7')
    .max(7, 'dow doit être compris entre 1 et 7')
    .optional(),
  opening_time: z
    .string()
    .trim()
    .min(1, 'opening_time est requis')
    .max(8, 'opening_time ne doit pas dépasser 8 caractères (HH:MM:SS)'),
  closing_time: z
    .string()
    .trim()
    .min(1, 'closing_time est requis')
    .max(8, 'closing_time ne doit pas dépasser 8 caractères (HH:MM:SS)'),
  profileUid: z.coerce.number().int().positive().optional(),
});

export type CreateOrangeAviTimesDto = z.infer<
  typeof createOrangeAviTimesSchema
>;

// Schéma de mise à jour : tous les champs deviennent optionnels.
// profileUid peut être explicitement `null` pour délier le profil.
export const updateOrangeAviTimesSchema = createOrangeAviTimesSchema
  .omit({ profileUid: true })
  .partial()
  .extend({
    profileUid: z.coerce.number().int().positive().nullable().optional(),
  });

export type UpdateOrangeAviTimesDto = z.infer<
  typeof updateOrangeAviTimesSchema
>;

// Schéma pour valider le param :id des routes (remplace ParseIntPipe si tu veux)
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Schéma pour valider le param :profileId des routes
export const profileIdParamSchema = z.object({
  profileId: z.coerce.number().int().positive(),
});
