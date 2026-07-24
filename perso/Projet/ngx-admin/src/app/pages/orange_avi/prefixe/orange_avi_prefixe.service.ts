import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrangeAviPrefixe } from './orange_avi_prefixe.model';

/**
 * Client HTTP pour la ressource `/oapres` (préfixes/DNIS/SDA de campagne Orange AVI).
 * Consommé par {@link OrangeAviPrefixeComponent} pour le CRUD de la table des préfixes.
 */
@Injectable({
  providedIn: 'root'
})
export class OrangeAviPrefixeService {
  private apiUrl = "http://localhost:3000/oapres";

  constructor(private http: HttpClient) {}

  /** Récupère la liste complète des préfixes (avec leur profil associé le cas échéant). */
  getOaps(): Observable<OrangeAviPrefixe[]> {
    console.log('[API] GET', this.apiUrl);
    return this.http.get<OrangeAviPrefixe[]>(this.apiUrl).pipe(
      tap(data => console.log('[API] GET', this.apiUrl, '-> réponse:', data))
    );
  }

  /** Récupère un préfixe par son uid. */
  getOapsById(id: number): Observable<OrangeAviPrefixe> {
    console.log('[API] GET', `${this.apiUrl}/${id}`);
    return this.http.get<OrangeAviPrefixe>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/${id}`, '-> réponse:', data))
    );
  }

  /** Crée un nouveau préfixe. */
  addOap(oap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    console.log('[API] POST', this.apiUrl, 'payload:', oap);
    return this.http.post<OrangeAviPrefixe>(this.apiUrl, oap).pipe(
      tap(data => console.log('[API] POST', this.apiUrl, '-> réponse:', data))
    );
  }

  /** Met à jour un préfixe existant (identifié par `updatedOap.uid`). */
  updateOap(updatedOap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    console.log('[API] PUT', `${this.apiUrl}/${updatedOap.uid}`, 'payload:', updatedOap);
    return this.http.put<OrangeAviPrefixe>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap).pipe(
      tap(data => console.log('[API] PUT', `${this.apiUrl}/${updatedOap.uid}`, '-> réponse:', data))
    );
  }

  /** Supprime un préfixe par son uid. */
  deleteOap(uid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/${uid}`);
    return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/${uid}`, '-> OK'))
    );
  }
}