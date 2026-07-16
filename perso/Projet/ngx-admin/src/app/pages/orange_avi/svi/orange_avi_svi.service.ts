import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrangeAviSvi } from './orange_avi_svi.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviSviService {
  private apiUrl = "http://localhost:3000/oasvi";

  constructor(private http: HttpClient) {}

  getOasvis(): Observable<OrangeAviSvi[]> {
    return this.http.get<OrangeAviSvi[]>(this.apiUrl);
  }

  getOasviById(uid: number): Observable<OrangeAviSvi> {
    return this.http.get<OrangeAviSvi>(`${this.apiUrl}/${uid}`);
  }

  getOasvisByProfile(profileUid: number): Observable<OrangeAviSvi[]> {
    return this.http.get<OrangeAviSvi[]>(`${this.apiUrl}/profile/${profileUid}`);
  }

  addOasvi(oasvi: OrangeAviSvi): Observable<OrangeAviSvi> {
    return this.http.post<OrangeAviSvi>(this.apiUrl, oasvi);
  }

  updateOasvi(uid: number, oasvi: OrangeAviSvi): Observable<OrangeAviSvi> {
    return this.http.put<OrangeAviSvi>(`${this.apiUrl}/${uid}`, oasvi);
  }

  deleteOasvi(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  deleteOasvisByProfile(profileUid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile/${profileUid}`);
  }
}
