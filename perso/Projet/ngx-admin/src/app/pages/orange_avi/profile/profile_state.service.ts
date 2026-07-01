import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrangeAviProfile } from './orange_avi_profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileStateService {
  private selectedProfileSource = new BehaviorSubject<OrangeAviProfile | null>(null);
  currentProfile$ = this.selectedProfileSource.asObservable();

  private tabSwitchSource = new Subject<void>();
  tabSwitch$ = this.tabSwitchSource.asObservable();

  // =========================================================================
  // AJOUT : Événement global pour notifier un changement de données en BDD
  // =========================================================================
  private profilesChangedSource = new Subject<void>();
  profilesChanged$ = this.profilesChangedSource.asObservable();

  changeProfile(profile: OrangeAviProfile, triggerTabSwitch: boolean = false) {
    this.selectedProfileSource.next(profile);
    if (triggerTabSwitch) {
      this.tabSwitchSource.next();
    }
  }

  getProfile(): OrangeAviProfile | null {
    return this.selectedProfileSource.getValue();
  }

  // =========================================================================
  // AJOUT : Méthode appelée par les composants après un Add / Update / Delete
  // =========================================================================
  notifyProfilesChanged(): void {
    this.profilesChangedSource.next();
  }
}