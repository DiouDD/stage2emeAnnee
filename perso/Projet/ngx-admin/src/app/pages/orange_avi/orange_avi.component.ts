// orange_avi.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileStateService } from './profile/profile_state.service'; // Ajuste le chemin selon ton projet

@Component({
  selector: 'ngx-orange-avi',
  templateUrl: './orange_avi.component.html',
  styleUrls: ['./orange_avi.component.scss']
})
export class OrangeAviComponent implements OnInit, OnDestroy {

  // ==========================================
  // Propriétés (Properties)
  // ==========================================

  /** Contrôle l'affichage de l'onglet 'Préfixes' */
  public isPrefixesActive: boolean = true;

  /** Contrôle l'affichage de l'onglet 'Modifier le profil' */
  public isTimesActive: boolean = false;
  
  /** Gestionnaire centralisé des abonnements RxJS pour éviter les fuites de mémoire */
  private tabSubscription: Subscription = new Subscription();

  // ==========================================
  // Constructeur (Constructor)
  // ==========================================

  constructor(private profileStateService: ProfileStateService) { }

  // ==========================================
  // Cycle de vie (Lifecycle Hooks)
  // ==========================================

  /**
   * Initialisation du composant.
   * Met en place l'écouteur sur le service d'état du profil.
   */
  ngOnInit(): void {
    // On s'abonne au signal de changement d'onglet (via le clic sur l'icône de l'œil)
    this.tabSubscription = this.profileStateService.tabSwitch$.subscribe(() => {
      // Utilisation de setTimeout pour pousser le changement dans le prochain cycle de détection Angular
      setTimeout(() => {
        this.isPrefixesActive = false;
        this.isTimesActive = true;
      });
    });
  }

  /**
   * Destruction du composant.
   * Libère les ressources pour garantir les performances.
   */
  ngOnDestroy(): void {
    // Désabonnement strict pour éviter les fuites de mémoire en quittant la page
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
  }

  // ==========================================
  // Méthodes publiques (Public Methods)
  // ==========================================

  /**
   * Gère le changement manuel d'onglet par l'utilisateur.
   * @param tab L'événement ou l'objet représentant l'onglet sélectionné.
   */
  public onTabChange(tab: any): void {
    // Met à jour l'état des variables selon le titre de l'onglet cliqué
    this.isPrefixesActive = tab.tabTitle === 'Préfixes';
    this.isTimesActive = tab.tabTitle === 'Modifier le profil';
  }
}