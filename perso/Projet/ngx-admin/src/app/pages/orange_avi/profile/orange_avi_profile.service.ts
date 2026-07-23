import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { OrangeAviProfile } from './orange_avi_profile.model';

@Injectable({
  providedIn: 'root'
})
export class OrangeAviProfileService {
  private apiUrl = "http://localhost:3000/oapros";
  private filesUrl = "http://localhost:3000/files";

  /** Nom du Cache Storage (navigateur) utilisé pour persister la liste des fichiers. */
  private readonly FILES_CACHE_NAME = 'oap-files-cache';

  /** Cache en mémoire de l'Observable, pour ne déclencher qu'une seule lecture/écriture du Cache Storage par session. */
  private filesCache$: Observable<string[]> | null = null;

  constructor(private http: HttpClient){}

  getOaps(): Observable<OrangeAviProfile[]> {
    return this.http.get<OrangeAviProfile[]>(this.apiUrl);
  }

  getOapsById(id: number): Observable<OrangeAviProfile> {
    return this.http.get<OrangeAviProfile>(`${this.apiUrl}/${id}`);
  }
  
  addOap(oap: OrangeAviProfile): Observable<OrangeAviProfile> {
    return this.http.post<OrangeAviProfile>(this.apiUrl, oap);
  }

  updateOap(updatedOap: OrangeAviProfile): Observable<OrangeAviProfile> {
    console.log("Mise a jour du profil");
    return this.http.put<OrangeAviProfile>(`${this.apiUrl}/${updatedOap.uid}`, updatedOap)
  }

  deleteOap(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  duplicateOap(uid: number): Observable<OrangeAviProfile> {
    return this.http.post<OrangeAviProfile>(`${this.apiUrl}/${uid}/duplicate`, {});
  }

  /**
   * Récupère la liste de tous les fichiers audio disponibles côté serveur (endpoint /files)
   * et la stocke dans le Cache Storage du navigateur (celui visible dans DevTools > Application >
   * Cache Storage), pour que la donnée persiste même après un rechargement de page (F5) sans
   * refaire de requête réseau.
   */
  getFiles(): Observable<string[]> {
    if (!this.filesCache$) {
      this.filesCache$ = from(this.fetchFilesWithCacheStorage()).pipe(
        shareReplay(1)
      );
    }
    return this.filesCache$;
  }

  /** Vide le Cache Storage des fichiers (ex: après ajout d'un nouveau fichier audio côté serveur). */
  async clearFilesCache(): Promise<void> {
    this.filesCache$ = null;
    const cache = await caches.open(this.FILES_CACHE_NAME);
    await cache.delete(this.filesUrl);
  }

  private async fetchFilesWithCacheStorage(): Promise<string[]> {
    const cache = await caches.open(this.FILES_CACHE_NAME);

    const cachedResponse = await cache.match(this.filesUrl);
    if (cachedResponse) {
      return cachedResponse.json();
    }

    const response = await fetch(this.filesUrl);
    await cache.put(this.filesUrl, response.clone());
    return response.json();
  }

  getAudioOptions(): Observable<string[]> {
    return this.getFiles();
  }
}