// orange_avi_prefixe.model.ts
import { OrangeAviProfile } from "../profile/orange_avi_profile.model";

export interface OrangeAviPrefixe {
  uid: number;
  dnis: string;
  sda: string;
  campagne: string;
  code_campagne: number;
  customer: string;
  profile?: OrangeAviProfile;
} 
