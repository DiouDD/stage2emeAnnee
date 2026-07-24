import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<OrangeAviPrefixe[]>(this.apiUrl);
  }

  /** Récupère un préfixe par son uid. */
  getOapsById(id: number): Observable<OrangeAviPrefixe> {
    return this.http.get<OrangeAviPrefixe>(`${this.apiUrl}/${id}`);
  }

  /** Crée un nouveau préfixe. */
  addOap(oap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    return this.http.post<OrangeAviPrefixe>(this.apiUrl, oap);
  }

  /** Met à jour un préfixe existant (identifié par `updatedOap.uid`). */
  updateOap(updatedOap: OrangeAviPrefixe): Observable<OrangeAviPrefixe> {
    return this.http.put<OrangeAviPrefixe>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap);
  }

  /** Supprime un préfixe par son uid. */
  deleteOap(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }
}