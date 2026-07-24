import { z } from 'zod';

/**
 * Schéma de validation (Zod) d'un profil Orange AVI.
 * Un profil regroupe la configuration du SVI (Serveur Vocal Interactif) pour un
 * ensemble de préfixes : messages audio joués à chaque étape de l'appel, temps
 * d'attente, dissuasion, et éventuel barrage entrant.
 * Utilisé côté client pour valider les données avant tout appel à l'API
 * (création, édition via formulaire ou via le tableau ng2-smart-table).
 */
export const OrangeAviProfileSchema = z.object({
  /** Identifiant unique du profil (clé primaire). */
  uid: z.number(),
  /** Nom du profil, affiché dans le sélecteur et le tableau. */
  profile: z.string(),
  /** Description libre du profil. */
  description: z.string(),
  /** Temps limite (en secondes) passé dans la file d'attente avant bascule. */
  waiting_time: z.number(),
  /** Nom du fichier audio joué en message d'accueil ("Aucun" si aucun). */
  audio_welcome: z.string(),
  /** Nom du fichier audio joué pendant l'attente en file. */
  audio_waiting: z.string(),
  /** Nom du fichier audio joué en dissuasion (raccrochage auto si "Aucun"). */
  audio_dissuasion: z.string(),
  /** Nom du fichier audio joué à la fermeture (hors horaires). */
  audio_closing: z.string(),
  /** Nom du fichier audio joué en cas de flash/message exceptionnel court. */
  audio_flash: z.string(),
  /** Nom du fichier audio joué en cas de fermeture exceptionnelle. */
  audio_exceptionnel: z.string(),
  /** Type de dissuasion appliqué (ex: 'TRANSFERT_EXTENSION', ou '' si aucun). */
  type_dissuasion: z.string(),
  /** Paramètre complémentaire du type de dissuasion (ex: extension à joindre). */
  ch1_dissuasion: z.string(),
  /** Indique si le SVI (menu vocal) est actif pour ce profil (1 = actif, 0 = inactif). */
  menu_actif: z.number(),
  /** Nom du fichier audio joué en barrage sur les appels entrants. */
  barrage_entrant: z.string(),
});

/** Type TypeScript inféré du schéma {@link OrangeAviProfileSchema}. */
export type OrangeAviProfile = z.infer<typeof OrangeAviProfileSchema>;