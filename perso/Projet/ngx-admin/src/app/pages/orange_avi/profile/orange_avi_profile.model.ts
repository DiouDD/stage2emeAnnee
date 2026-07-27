/**
 * Un profil regroupe la configuration du SVI (Serveur Vocal Interactif) pour un
 * ensemble de préfixes : messages audio joués à chaque étape de l'appel, temps
 * d'attente, dissuasion, et éventuel barrage entrant.
 */
export interface OrangeAviProfile {
  /** Identifiant unique du profil (clé primaire). */
  uid: number;
  /** Nom du profil, affiché dans le sélecteur et le tableau. */
  profile: string;
  /** Description libre du profil. */
  description: string;
  /** Temps limite (en secondes) passé dans la file d'attente avant bascule. */
  waiting_time: number;
  /** Nom du fichier audio joué en message d'accueil ("Aucun" si aucun). */
  audio_welcome: string;
  /** Nom du fichier audio joué pendant l'attente en file. */
  audio_waiting: string;
  /** Nom du fichier audio joué en dissuasion (raccrochage auto si "Aucun"). */
  audio_dissuasion: string;
  /** Nom du fichier audio joué à la fermeture (hors horaires). */
  audio_closing: string;
  /** Nom du fichier audio joué en cas de flash/message exceptionnel court. */
  audio_flash: string;
  /** Nom du fichier audio joué en cas de fermeture exceptionnelle. */
  audio_exceptionnel: string;
  /** Type de dissuasion appliqué (ex: 'TRANSFERT_EXTENSION', ou '' si aucun). */
  type_dissuasion: string;
  /** Paramètre complémentaire du type de dissuasion (ex: extension à joindre). */
  ch1_dissuasion: string;
  /** Indique si le SVI (menu vocal) est actif pour ce profil (1 = actif, 0 = inactif). */
  menu_actif: number;
  /** Nom du fichier audio joué en barrage sur les appels entrants. */
  barrage_entrant: string;
}
