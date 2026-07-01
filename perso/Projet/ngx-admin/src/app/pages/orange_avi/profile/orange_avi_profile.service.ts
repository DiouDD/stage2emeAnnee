import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrangeAviProfile } from './orange_avi_profile.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviProfileService {  
  private apiUrl = "http://localhost:3000/oapros";

  constructor(private http: HttpClient){}

  getOaps(): Observable<OrangeAviProfile[]> {
    return this.http.get<OrangeAviProfile[]>(this.apiUrl);
  }

  getOapsById(id: number): Observable<OrangeAviProfile> {
    return this.http.get<OrangeAviProfile>(`${this.apiUrl}/${id}`);
  }
  
  addOap(oap: OrangeAviProfile): Observable<OrangeAviProfile> {
    return this.http.post<OrangeAviProfile>(this.apiUrl, oap);
  }

  updateOap(updatedOap: OrangeAviProfile): Observable<OrangeAviProfile> {
    console.log("Mise a jour du profil");
    return this.http.put<OrangeAviProfile>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap)
  }

  deleteOap(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  getAudioOptions(): Observable<string[]> {
    return this.getOaps().pipe(
      map(profiles => {
        const allAudios = new Set<string>();
        
        profiles.forEach(profile => {
          if (profile.audio_welcome) allAudios.add(profile.audio_welcome);
          if (profile.audio_waiting) allAudios.add(profile.audio_waiting);
          if (profile.audio_dissuasion) allAudios.add(profile.audio_dissuasion);
          if (profile.audio_closing) allAudios.add(profile.audio_closing);
          if (profile.audio_flash) allAudios.add(profile.audio_flash);
          if (profile.audio_exceptionnel) allAudios.add(profile.audio_exceptionnel);
        });
        
        return Array.from(allAudios).sort();
      })
    );
  }
}