import { z } from 'zod';

// Schéma de création
// profileUid est requis : la relation id_profile n'est pas nullable en base.
export const createOrangeAviSviSchema = z.object({
  profileUid: z.coerce.number().int().positive('profileUid est requis'),
  menu_0_action: z.string().trim().max(50).nullable().optional(),
  menu_0_ch: z.string().trim().max(50).nullable().optional(),
  menu_1_action: z.string().trim().max(50).nullable().optional(),
  menu_1_ch: z.string().trim().max(50).nullable().optional(),
  menu_2_action: z.string().trim().max(50).nullable().optional(),
  menu_2_ch: z.string().trim().max(50).nullable().optional(),
  menu_3_action: z.string().trim().max(50).nullable().optional(),
  menu_3_ch: z.string().trim().max(50).nullable().optional(),
  menu_4_action: z.string().trim().max(50).nullable().optional(),
  menu_4_ch: z.string().trim().max(50).nullable().optional(),
  menu_5_action: z.string().trim().max(50).nullable().optional(),
  menu_5_ch: z.string().trim().max(50).nullable().optional(),
  menu_diese_action: z.string().trim().max(50).nullable().optional(),
  menu_diese_ch: z.string().trim().max(50).nullable().optional(),
  menu_etoile_action: z.string().trim().max(50).nullable().optional(),
  menu_etoile_ch: z.string().trim().max(50).nullable().optional(),
  audio_svi: z.string().trim().max(50).nullable().optional(),
});

export type CreateOrangeAviSviDto = z.infer<typeof createOrangeAviSviSchema>;

// Schéma de mise à jour : tous les champs deviennent optionnels.
export const updateOrangeAviSviSchema = createOrangeAviSviSchema
  .omit({ profileUid: true })
  .partial()
  .extend({
    profileUid: z.coerce.number().int().positive().optional(),
  });

export type UpdateOrangeAviSviDto = z.infer<typeof updateOrangeAviSviSchema>;

// Schéma pour valider le param :id des routes
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
