import { z } from 'zod';

// Schéma de création : reflète les colonnes de l'entité (hors uid, généré par la DB)
export const createOrangeAviProfileSchema = z.object({
  profile: z.string().trim().min(1, 'profile est requis').max(50),
  description: z.string().trim().max(200).optional(),
  waiting_time: z.coerce.number().int().optional(),
  audio_welcome: z.string().trim().max(50).optional(),
  audio_waiting: z.string().trim().max(50).optional(),
  audio_dissuasion: z.string().trim().max(50).optional(),
  audio_closing: z.string().trim().max(50).optional(),
  audio_flash: z.string().trim().max(50).optional(),
  audio_exceptionnel: z.string().trim().max(50).optional(),
  type_dissuasion: z.string().trim().max(100).optional(),
  ch1_dissuasion: z.string().trim().max(100).optional(),
  menu_actif: z.coerce.number().int().optional(),
  barrage_entrant: z.string().trim().max(100).optional(),
});

export type CreateOrangeAviProfileDto = z.infer<
  typeof createOrangeAviProfileSchema
>;

// Schéma de mise à jour : tous les champs deviennent optionnels
export const updateOrangeAviProfileSchema =
  createOrangeAviProfileSchema.partial();

export type UpdateOrangeAviProfileDto = z.infer<
  typeof updateOrangeAviProfileSchema
>;

// Utile si tu veux remplacer ParseIntPipe par ce schéma sur le param :id
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
