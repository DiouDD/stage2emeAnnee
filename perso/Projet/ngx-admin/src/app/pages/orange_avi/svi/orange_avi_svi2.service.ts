import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrangeAviSvi2 } from './orange_avi_svi2.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviSvi2Service {
  private apiUrl = "http://localhost:3000/oasvi2";

  constructor(private http: HttpClient) {}

  getOasvi2s(): Observable<OrangeAviSvi2[]> {
    console.log('[API] GET', this.apiUrl);
    return this.http.get<OrangeAviSvi2[]>(this.apiUrl).pipe(
      tap(data => console.log('[API] GET', this.apiUrl, '-> réponse:', data))
    );
  }

  getOasvi2ById(uid: number): Observable<OrangeAviSvi2> {
    console.log('[API] GET', `${this.apiUrl}/${uid}`);
    return this.http.get<OrangeAviSvi2>(`${this.apiUrl}/${uid}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/${uid}`, '-> réponse:', data))
    );
  }

  getOasvi2sByProfile(profileUid: number): Observable<OrangeAviSvi2[]> {
    console.log('[API] GET', `${this.apiUrl}/profile/${profileUid}`);
    return this.http.get<OrangeAviSvi2[]>(`${this.apiUrl}/profile/${profileUid}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/profile/${profileUid}`, '-> réponse:', data))
    );
  }

  addOasvi2(oasvi2: OrangeAviSvi2): Observable<OrangeAviSvi2> {
    console.log('[API] POST', this.apiUrl, 'payload:', oasvi2);
    return this.http.post<OrangeAviSvi2>(this.apiUrl, oasvi2).pipe(
      tap(data => console.log('[API] POST', this.apiUrl, '-> réponse:', data))
    );
  }

  updateOasvi2(uid: number, oasvi2: OrangeAviSvi2): Observable<OrangeAviSvi2> {
    console.log('[API] PUT', `${this.apiUrl}/${uid}`, 'payload:', oasvi2);
    return this.http.put<OrangeAviSvi2>(`${this.apiUrl}/${uid}`, oasvi2).pipe(
      tap(data => console.log('[API] PUT', `${this.apiUrl}/${uid}`, '-> réponse:', data))
    );
  }

  deleteOasvi2(uid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/${uid}`);
    return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/${uid}`, '-> OK'))
    );
  }

  deleteOasvi2sByProfile(profileUid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/profile/${profileUid}`);
    return this.http.delete<void>(`${this.apiUrl}/profile/${profileUid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/profile/${profileUid}`, '-> OK'))
    );
  }
}
