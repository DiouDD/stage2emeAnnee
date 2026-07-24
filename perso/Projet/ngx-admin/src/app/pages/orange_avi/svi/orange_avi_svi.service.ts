import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrangeAviSvi } from './orange_avi_svi.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviSviService {
  private apiUrl = "http://localhost:3000/oasvi";

  constructor(private http: HttpClient) {}

  getOasvis(): Observable<OrangeAviSvi[]> {
    console.log('[API] GET', this.apiUrl);
    return this.http.get<OrangeAviSvi[]>(this.apiUrl).pipe(
      tap(data => console.log('[API] GET', this.apiUrl, '-> réponse:', data))
    );
  }

  getOasviById(uid: number): Observable<OrangeAviSvi> {
    console.log('[API] GET', `${this.apiUrl}/${uid}`);
    return this.http.get<OrangeAviSvi>(`${this.apiUrl}/${uid}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/${uid}`, '-> réponse:', data))
    );
  }

  getOasvisByProfile(profileUid: number): Observable<OrangeAviSvi[]> {
    console.log('[API] GET', `${this.apiUrl}/profile/${profileUid}`);
    return this.http.get<OrangeAviSvi[]>(`${this.apiUrl}/profile/${profileUid}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/profile/${profileUid}`, '-> réponse:', data))
    );
  }

  addOasvi(oasvi: OrangeAviSvi): Observable<OrangeAviSvi> {
    console.log('[API] POST', this.apiUrl, 'payload:', oasvi);
    return this.http.post<OrangeAviSvi>(this.apiUrl, oasvi).pipe(
      tap(data => console.log('[API] POST', this.apiUrl, '-> réponse:', data))
    );
  }

  updateOasvi(uid: number, oasvi: OrangeAviSvi): Observable<OrangeAviSvi> {
    console.log('[API] PUT', `${this.apiUrl}/${uid}`, 'payload:', oasvi);
    return this.http.put<OrangeAviSvi>(`${this.apiUrl}/${uid}`, oasvi).pipe(
      tap(data => console.log('[API] PUT', `${this.apiUrl}/${uid}`, '-> réponse:', data))
    );
  }

  deleteOasvi(uid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/${uid}`);
    return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/${uid}`, '-> OK'))
    );
  }

  deleteOasvisByProfile(profileUid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/profile/${profileUid}`);
    return this.http.delete<void>(`${this.apiUrl}/profile/${profileUid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/profile/${profileUid}`, '-> OK'))
    );
  }
}
