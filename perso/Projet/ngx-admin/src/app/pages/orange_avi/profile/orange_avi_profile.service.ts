import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrangeAviProfile } from './orange_avi_profile.model';

/**
 * Service d'accès à l'API REST des profils Orange AVI (endpoint `/oapros`).
 * Centralise les appels HTTP (CRUD + duplication) ainsi que la récupération,
 * avec mise en cache, de la liste des fichiers audio disponibles (`/files`)
 * utilisée pour peupler les listes déroulantes de messages du composant.
 */
@Injectable({
  providedIn: 'root'
})
export class OrangeAviProfileService {
  /** URL de base de l'API des profils Orange AVI. */
  private apiUrl = "http://localhost:3000/oapros";
  /** URL de l'API listant les fichiers audio disponibles sur le serveur. */
  private filesUrl = "http://localhost:3000/files";

  /** Durée de vie du cache en mémoire avant rechargement forcé depuis le serveur. */
  private readonly FILES_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 heures

  /** Cache en mémoire (perdu au rechargement de page) de la liste des fichiers. */
  private filesCacheEntry: { data: string[]; expiresAt: number } | null = null;

  constructor(private http: HttpClient){}

  /** Récupère la liste complète des profils Orange AVI (`GET /oapros`). */
  getOaps(): Observable<OrangeAviProfile[]> {
    console.log('[API] GET', this.apiUrl);
    return this.http.get<OrangeAviProfile[]>(this.apiUrl).pipe(
      tap(data => console.log('[API] GET', this.apiUrl, '-> réponse:', data))
    );
  }

  /** Récupère un profil unique par son uid (`GET /oapros/:id`). */
  getOapsById(id: number): Observable<OrangeAviProfile> {
    console.log('[API] GET', `${this.apiUrl}/${id}`);
    return this.http.get<OrangeAviProfile>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log('[API] GET', `${this.apiUrl}/${id}`, '-> réponse:', data))
    );
  }

  /** Crée un nouveau profil (`POST /oapros`). */
  addOap(oap: OrangeAviProfile): Observable<OrangeAviProfile> {
    console.log('[API] POST', this.apiUrl, 'payload:', oap);
    return this.http.post<OrangeAviProfile>(this.apiUrl, oap).pipe(
      tap(data => console.log('[API] POST', this.apiUrl, '-> réponse:', data))
    );
  }

  /** Met à jour un profil existant, identifié par `updatedOap.uid` (`PUT /oapros/:id`). */
  updateOap(updatedOap: OrangeAviProfile): Observable<OrangeAviProfile> {
    console.log('[API] PUT', `${this.apiUrl}/${updatedOap.uid}`, 'payload:', updatedOap);
    return this.http.put<OrangeAviProfile>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap).pipe(
      tap(data => console.log('[API] PUT', `${this.apiUrl}/${updatedOap.uid}`, '-> réponse:', data))
    );
  }

  /** Supprime un profil par son uid (`DELETE /oapros/:id`). Échoue si le profil est encore utilisé par un préfixe. */
  deleteOap(uid: number): Observable<void> {
    console.log('[API] DELETE', `${this.apiUrl}/${uid}`);
    return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
      tap(() => console.log('[API] DELETE', `${this.apiUrl}/${uid}`, '-> OK'))
    );
  }

  /**
   * Duplique un profil et tous ses horaires en une seule requête serveur
   * (`POST /oapros/:id/duplicate`). Le profil créé reçoit le nom `"<original>_copy"`.
   */
  duplicateOap(uid: number): Observable<OrangeAviProfile> {
    console.log('[API] POST', `${this.apiUrl}/${uid}/duplicate`);
    return this.http.post<OrangeAviProfile>(`${this.apiUrl}/${uid}/duplicate`, {}).pipe(
      tap(data => console.log('[API] POST', `${this.apiUrl}/${uid}/duplicate`, '-> réponse:', data))
    );
  }

  /**
   * Récupère la liste de tous les fichiers audio disponibles côté serveur (endpoint /files).
   * Le résultat est gardé en mémoire pendant FILES_CACHE_TTL_MS (2h) : tant que le cache est
   * valide, aucun appel HTTP n'est refait ; une fois expiré (ou après un rechargement de page),
   * une nouvelle requête est envoyée et le cache est renouvelé.
   */
  getFiles(): Observable<string[]> {
    if (this.filesCacheEntry && Date.now() < this.filesCacheEntry.expiresAt) {
      console.log('[API] GET', this.filesUrl, '-> depuis le cache (pas de requête réseau)');
      return of(this.filesCacheEntry.data);
    }

    console.log('[API] GET', this.filesUrl);
    return this.http.get<string[]>(this.filesUrl).pipe(
      tap(data => {
        console.log('[API] GET', this.filesUrl, '-> réponse:', data);
        this.filesCacheEntry = { data, expiresAt: Date.now() + this.FILES_CACHE_TTL_MS };
      })
    );
  }

  /** Invalide le cache en mémoire (ex: après ajout d'un nouveau fichier audio côté serveur). */
  clearFilesCache(): void {
    this.filesCacheEntry = null;
  }

  /** Alias public de {@link getFiles}, utilisé par le composant pour peupler les `<nb-select>` audio. */
  getAudioOptions(): Observable<string[]> {
    return this.getFiles();
  }
}