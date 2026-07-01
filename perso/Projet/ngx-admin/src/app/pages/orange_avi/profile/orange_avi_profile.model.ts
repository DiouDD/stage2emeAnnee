import { z } from 'zod';

export const OrangeAviProfileSchema = z.object({
  uid: z.number(),
  profile: z.string(),
  description: z.string(),
  waiting_time: z.number(),
  audio_welcome: z.string(),
  audio_waiting: z.string(),
  audio_dissuasion: z.string(),
  audio_closing: z.string(),
  audio_flash: z.string(),
  audio_exceptionnel: z.string(),
  type_dissuasion: z.string(),
  ch1_dissuasion: z.string(),
  menu_actif: z.number(),
  barrage_entrant: z.string(),
});

export type OrangeAviProfile = z.infer<typeof OrangeAviProfileSchema>;