import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrangeAviTimes } from './orange_avi_times.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviTimesService {  
  private apiUrl = "http://localhost:3000/oat";

  constructor(private http: HttpClient){}

  getOats(): Observable<OrangeAviTimes[]> {
    return this.http.get<OrangeAviTimes[]>(this.apiUrl);
  }

  getOatById(id: number): Observable<OrangeAviTimes> {
    return this.http.get<OrangeAviTimes>(`${this.apiUrl}/${id}`);
  }

  getOatsById(id_profile: number): Observable<OrangeAviTimes[]> {
    return this.http.get<OrangeAviTimes[]>(`${this.apiUrl}/profile/${id_profile}`);
  }

  addOat(oat: OrangeAviTimes): Observable<OrangeAviTimes> {
    return this.http.post<OrangeAviTimes>(this.apiUrl, oat);
  }

  updateOat(updatedOat: OrangeAviTimes): Observable<OrangeAviTimes> {
    return this.http.put<OrangeAviTimes>(`${this.apiUrl}/${updatedOat.uid}`, updatedOat);
  }

  deleteOat(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  deleteOatsByIdProfile(id_profile: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile/${id_profile}`);
  }
} 