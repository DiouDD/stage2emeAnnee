import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrangeAviSvi2 } from './orange_avi_svi2.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviSvi2Service {
  private apiUrl = "http://localhost:3000/oasvi2";

  constructor(private http: HttpClient) {}

  getOasvi2s(): Observable<OrangeAviSvi2[]> {
    return this.http.get<OrangeAviSvi2[]>(this.apiUrl);
  }

  getOasvi2ById(uid: number): Observable<OrangeAviSvi2> {
    return this.http.get<OrangeAviSvi2>(`${this.apiUrl}/${uid}`);
  }

  getOasvi2sByProfile(profileUid: number): Observable<OrangeAviSvi2[]> {
    return this.http.get<OrangeAviSvi2[]>(`${this.apiUrl}/profile/${profileUid}`);
  }

  addOasvi2(oasvi2: OrangeAviSvi2): Observable<OrangeAviSvi2> {
    return this.http.post<OrangeAviSvi2>(this.apiUrl, oasvi2);
  }

  updateOasvi2(uid: number, oasvi2: OrangeAviSvi2): Observable<OrangeAviSvi2> {
    return this.http.put<OrangeAviSvi2>(`${this.apiUrl}/${uid}`, oasvi2);
  }

  deleteOasvi2(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  deleteOasvi2sByProfile(profileUid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile/${profileUid}`);
  }
}
