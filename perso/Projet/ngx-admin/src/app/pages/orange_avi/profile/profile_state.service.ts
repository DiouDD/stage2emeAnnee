import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrangeAviProfile } from './orange_avi_profile.model';

/**
 * Service d'état partagé (cross-composants) pour la fonctionnalité Orange AVI.
 * Fait le lien entre la page des préfixes (`orange_avi_prefixe`), l'onglet Profil
 * (`orange_avi_profile`) et le composant hôte (`orange_avi`) qui gère les onglets,
 * sans dépendance directe entre ces composants :
 * - `currentProfile$` : diffuse le profil choisi (ex: clic sur l'œil dans la table des préfixes).
 * - `tabSwitch$` : signale au composant hôte qu'il doit basculer vers l'onglet "Modifier le profil".
 * - `profilesChanged$` : signale que la liste des profils en base a changé (add/update/delete/duplicate),
 *   pour que d'autres vues (ex: la table des préfixes) puissent se rafraîchir.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileStateService {
  private selectedProfileSource = new BehaviorSubject<OrangeAviProfile | null>(null);
  /** Flux du profil actuellement sélectionné (null tant qu'aucun profil n'a été choisi). */
  currentProfile$ = this.selectedProfileSource.asObservable();

  private tabSwitchSource = new Subject<void>();
  /** Émis pour demander au composant hôte de basculer sur l'onglet "Modifier le profil". */
  tabSwitch$ = this.tabSwitchSource.asObservable();

  private profilesChangedSource = new Subject<void>();
  /** Émis après toute création/modification/suppression/duplication de profil en base. */
  profilesChanged$ = this.profilesChangedSource.asObservable();

  /**
   * Change le profil sélectionné et diffuse la nouvelle valeur à tous les abonnés.
   * @param profile Le profil à sélectionner.
   * @param triggerTabSwitch Si `true`, force en plus le basculement vers l'onglet "Modifier le profil".
   */
  changeProfile(profile: OrangeAviProfile, triggerTabSwitch: boolean = false) {
    this.selectedProfileSource.next(profile);
    if (triggerTabSwitch) {
      this.tabSwitchSource.next();
    }
  }

  /** Retourne la valeur courante (synchrone) du profil sélectionné. */
  getProfile(): OrangeAviProfile | null {
    return this.selectedProfileSource.getValue();
  }

  /** À appeler après un Add / Update / Delete / Duplicate pour notifier les autres vues. */
  notifyProfilesChanged(): void {
    this.profilesChangedSource.next();
  }
}