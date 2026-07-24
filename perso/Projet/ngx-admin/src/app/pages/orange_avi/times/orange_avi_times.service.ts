import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrangeAviTimes } from './orange_avi_times.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviTimesService {
  private apiUrl = "http://localhost:3000/oat";

  constructor(private http: HttpClient){}

  getOats(): Observable<OrangeAviTimes[]> {
    console.log('[API] GET', this.apiUrl);
    return this.http.get<OrangeAviTimes[]>(this.apiUrl).pipe(
      tap(data => console.log('[API] GET', this.apiUrl, '-> réponse:', data))
    );
  }

  getOatById(id: number): Observable<OrangeAviTimes> {
    console.log('[API] GET', `${this.apiUrl}/${id}`);
    return this.http.get<OrangeAviTimes>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/${id}`, '-> réponse:', data))
    );
  }

  getOatsById(id_profile: number): Observable<OrangeAviTimes[]> {
    console.log('[API] GET', `${this.apiUrl}/profile/${id_profile}`);
    return this.http.get<OrangeAviTimes[]>(`${this.apiUrl}/profile/${id_profile}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/profile/${id_profile}`, '-> réponse:', data))
    );
  }

  addOat(oat: OrangeAviTimes): Observable<OrangeAviTimes> {
    console.log('[API] POST', this.apiUrl, 'payload:', oat);
    return this.http.post<OrangeAviTimes>(this.apiUrl, oat).pipe(
      tap(data => console.log('[API] POST', this.apiUrl, '-> réponse:', data))
    );
  }

  updateOat(updatedOat: OrangeAviTimes): Observable<OrangeAviTimes> {
    console.log('[API] PUT', `${this.apiUrl}/${updatedOat.uid}`, 'payload:', updatedOat);
    return this.http.put<OrangeAviTimes>(`${this.apiUrl}/${updatedOat.uid}`, updatedOat).pipe(
      tap(data => console.log('[API] PUT', `${this.apiUrl}/${updatedOat.uid}`, '-> réponse:', data))
    );
  }

  deleteOat(uid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/${uid}`);
    return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/${uid}`, '-> OK'))
    );
  }

  deleteOatsByIdProfile(id_profile: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/profile/${id_profile}`);
    return this.http.delete<void>(`${this.apiUrl}/profile/${id_profile}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/profile/${id_profile}`, '-> OK'))
    );
  }
}