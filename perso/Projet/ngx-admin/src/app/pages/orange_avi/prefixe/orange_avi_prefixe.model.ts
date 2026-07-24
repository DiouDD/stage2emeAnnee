// orange_avi_prefixe.model.ts
import { OrangeAviProfile } from "../profile/orange_avi_profile.model";

/**
 * Un préfixe/DNIS de campagne Orange AVI, tel que renvoyé par l'API `/oapres`.
 * Correspond à la table `orange_avi_prefixe` (voir l'entité backend du même nom) ;
 * chaque préfixe peut être associé à un {@link OrangeAviProfile} (relation optionnelle).
 */
export interface OrangeAviPrefixe {
  /** Identifiant unique du préfixe. */
  uid: number;
  /** Numéro appelé (DNIS - Dialed Number Identification Service). */
  dnis: string;
  /** Numéro SDA (Sélection Directe à l'Arrivée) associé. */
  sda: string;
  /** Nom de la campagne. */
  campagne: string;
  /** Code numérique identifiant la campagne. */
  code_campagne: number;
  /** Identifiant/code du client. */
  customer: string;
  /** Profil Orange AVI associé à ce préfixe (routage/annonces), s'il y en a un. */
  profile?: OrangeAviProfile;
}
