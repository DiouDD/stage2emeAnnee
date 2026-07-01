import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrangeAviPrefixe } from './orange_avi_prefixe.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviPrefixeService {
  private apiUrl = "http://localhost:3000/oapres";

  constructor(private http: HttpClient) {}

  getOaps(): Observable<OrangeAviPrefixe[]> {
    return this.http.get<OrangeAviPrefixe[]>(this.apiUrl);
  }

  getOapsById(id: number): Observable<OrangeAviPrefixe> {
    return this.http.get<OrangeAviPrefixe>(`${this.apiUrl}/${id}`);
  }

  addOap(oap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    return this.http.post<OrangeAviPrefixe>(this.apiUrl, oap);
  }

  updateOap(updatedOap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    return this.http.put<OrangeAviPrefixe>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap);
  }

  deleteOap(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }
}