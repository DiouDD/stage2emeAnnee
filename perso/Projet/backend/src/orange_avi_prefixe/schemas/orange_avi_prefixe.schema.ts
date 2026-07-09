import { z } from 'zod';

// Schéma de création
// + profileUid, optionnel, pour lier un profil au moment de la création.
export const createOrangeAviPrefixeSchema = z.object({
  dnis: z.string().trim().min(1, 'dnis est requis').max(50),
  sda: z.string().trim().min(1, 'sda est requis').max(50),
  campagne: z.string().trim().min(1, 'campagne est requise').max(100),
  code_campagne: z.coerce.number().int('code_campagne doit être un entier'),
  customer: z.string().trim().min(1, 'customer est requis').max(10),
  profileUid: z.coerce.number().int().positive().optional(),
});

export type CreateOrangeAviPrefixeDto = z.infer<
  typeof createOrangeAviPrefixeSchema
>;

// Schéma de mise à jour : tous les champs deviennent optionnels.
// profileUid peut être explicitement `null` pour délier le profil (voir service.update).
export const updateOrangeAviPrefixeSchema = createOrangeAviPrefixeSchema
  .omit({ profileUid: true })
  .partial()
  .extend({
    profileUid: z.coerce.number().int().positive().nullable().optional(),
  });

export type UpdateOrangeAviPrefixeDto = z.infer<
  typeof updateOrangeAviPrefixeSchema
>;

// Schéma pour valider le param :id des routes
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
