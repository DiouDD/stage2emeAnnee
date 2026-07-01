export interface OrangeAviTimes {
  uid: number;
  profile: { uid: number; [key: string]: any } | null;
  day: Date;
  dow: number;
  opening_time: string;
  closing_time: string;
}
