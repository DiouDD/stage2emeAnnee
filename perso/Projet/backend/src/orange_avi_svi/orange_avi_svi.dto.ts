// Pas de validation Zod pour l'instant, sera ajoutée plus tard.
export interface CreateOrangeAviSviDto {
  profileUid: number;
  menu_0_action?: string;
  menu_0_ch?: string;
  menu_1_action?: string;
  menu_1_ch?: string;
  menu_2_action?: string;
  menu_2_ch?: string;
  menu_3_action?: string;
  menu_3_ch?: string;
  menu_4_action?: string;
  menu_4_ch?: string;
  menu_5_action?: string;
  menu_5_ch?: string;
  menu_diese_action?: string;
  menu_diese_ch?: string;
  menu_etoile_action?: string;
  menu_etoile_ch?: string;
  audio_svi?: string;
}

export type UpdateOrangeAviSviDto = Partial<CreateOrangeAviSviDto>;
