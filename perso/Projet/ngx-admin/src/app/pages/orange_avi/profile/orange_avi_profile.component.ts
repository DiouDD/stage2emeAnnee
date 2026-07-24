import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import { ProfileStateService } from './profile_state.service';
import { OrangeAviProfile, OrangeAviProfileSchema } from './orange_avi_profile.model';
import { OrangeAviSviComponent } from '../svi/orange_avi_svi.component';

/**
 * Onglet "Profil" de la fonctionnalité Orange AVI.
 *
 * Permet de :
 * - lister/créer/éditer/supprimer/dupliquer les profils via un tableau (ng2-smart-table) ;
 * - éditer en détail le profil sélectionné (nom, messages audio, temps d'attente,
 *   dissuasion, barrage entrant, activation du SVI) via un formulaire dédié ;
 * - afficher les horaires du profil ({@link OrangeAviTimesComponent}, enfant) et
 *   son SVI (menu vocal) dans une modale ({@link OrangeAviSviComponent}).
 *
 * Se synchronise avec le reste de la page Orange AVI via {@link ProfileStateService} :
 * un clic sur l'icône "œil" dans la table des préfixes sélectionne ici le profil
 * correspondant (voir `profileStateService.currentProfile$`).
 */
@Component({
  selector: 'ngx-orange-avi-profile',
  templateUrl: './orange_avi_profile.component.html',
  styleUrls: ['./orange_avi_profile.component.scss']
})
export class OrangeAviProfileComponent implements OnInit, OnDestroy {

  // ==========================================
  // Propriétés / Propriétés de configuration
  // ==========================================

  /** Source de données locale pour la table intelligente */
  public source: LocalDataSource = new LocalDataSource();
  /** Profil actuellement sélectionné tel que chargé depuis le serveur (référence "propre"). */
  selectedProfile: OrangeAviProfile | null = null;
  /** Liste complète des profils chargés depuis l'API, utilisée par le tableau et le sélecteur. */
  profiles: OrangeAviProfile[] = [];
  /** Copie éditable de `selectedProfile`, liée au formulaire (ngModel) ; envoyée au serveur lors de l'enregistrement. */
  newSelectedProfile: OrangeAviProfile | null = null;
  /** `true` dès qu'une modification du formulaire n'a pas encore été enregistrée (affiche les boutons Enregistrer/Annuler). */
  isEditing: boolean = false;
  /** Liste des noms de fichiers audio disponibles, utilisée pour peupler les `<nb-select>` de messages. */
  audioOptions: string[] = [];
  /** Uid du profil sélectionné, transmis en `@Input` au composant enfant des horaires ({@link OrangeAviTimesComponent}). */
  selectedProfileId: number = 1;
  /** `true` quand le champ "Nom" est en mode édition (input texte au lieu du sélecteur déroulant). */
  isEditingProfileName: boolean = false;
  /**
   * Uid d'un profil dont la sélection a été demandée (via {@link ProfileStateService})
   * avant que `loadOrangeAviProfiles()` n'ait fini de charger la liste. Résolu dès que
   * les données arrivent (voir `selectProfileByUid`).
   */
  private pendingProfileUid: number | null = null;

  /** Abonnement à `profileStateService.currentProfile$`, nettoyé dans `ngOnDestroy`. */
  private profileSubscription: Subscription = new Subscription();

  // ==========================================
  // Constructeur & Cycles de vie
  // ==========================================

  constructor(
    /** Accès à l'API REST des profils (CRUD, duplication, liste des fichiers audio). */
    private oapService: OrangeAviProfileService,
    /** État partagé entre les onglets/composants Orange AVI (profil sélectionné, notifications de changement). */
    private profileStateService: ProfileStateService,
    /** Service Nebular utilisé pour ouvrir la modale du SVI. */
    private dialogService: NbDialogService
  ) {}

  /**
   * Initialisation du composant.
   */
  ngOnInit(): void {
    console.dir('ngOnInits')
    this.loadAudioOptions();
    this.loadOrangeAviProfiles();

    // Sélectionne le profil choisi depuis la page des préfixes (clic sur un profil)
    this.profileSubscription = this.profileStateService.currentProfile$.subscribe(profile => {
      console.dir(`profileStateService.currentProfile`)
      console.dir(profile)
      if (profile) {
        this.selectProfileByUid(profile.uid);
      }
    });
    console.dir(this.newSelectedProfile)
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }

  /**
   * Sélectionne, parmi les profils déjà chargés, celui dont l'uid correspond.
   * Si la liste n'est pas encore chargée (ex: clic venant de la page des préfixes
   * avant la fin de l'appel HTTP initial), l'uid est mémorisé pour être résolu
   * dès que loadOrangeAviProfiles() aura terminé.
   */
  private selectProfileByUid(uid: number): void {
    const found = this.profiles.find(p => p.uid === uid);
    if (found) {
      this.pendingProfileUid = null;
      this.selectedProfile = found;
      this.newSelectedProfile = { ...found };
      this.isEditing = false;
      this.isEditingProfileName = false;
      this.onProfileSelected(found.uid);
      console.dir(this.newSelectedProfile)
    } else {
      this.pendingProfileUid = uid;
    }
  }

  // ==========================================
  // Méthodes de gestion des données (API)
  // ==========================================

  /**
   * Charge la liste complète des profils depuis la base de données.
   */
  public loadOrangeAviProfiles(): void {
    this.oapService.getOaps().subscribe({
      next: (data) => {
        this.source.load(data);
        this.profiles = data;

        /*if (this.pendingProfileUid != null) {
          // Une sélection était en attente (course avec cet appel HTTP) : on la résout maintenant.
          this.selectProfileByUid(this.pendingProfileUid);
        } else if (data.length > 0 && !this.selectedProfile) {
          // Sélection automatique du premier profil au démarrage
          this.selectedProfile = data[0];
          this.newSelectedProfile = { ...data[0] };
          this.onProfileSelected(data[0].uid);
        }*/
      },
      error: (err) => {
        console.error('Erreur lors du chargement des profils :', err);
      }
    });
  }

  /**
   * Met à jour `selectedProfileId`, ce qui déclenche automatiquement `ngOnChanges`
   * dans le composant enfant des horaires ({@link OrangeAviTimesComponent}).
   */
  onProfileSelected(newId: number): void {
    this.selectedProfileId = newId; // déclenche automatiquement ngOnChanges dans l'enfant
  }


  /**
   * Déclenché lors du changement manuel de profil via la liste déroulante (select)
   */
  onProfileChange(profileName: string | undefined): void {
    if (!profileName) return;
    
    const selectedProf = this.profiles.find(p => p.profile === profileName);
    if (selectedProf) {
      this.selectedProfile = selectedProf;
      this.newSelectedProfile = { ...selectedProf };
      this.onProfileSelected(selectedProf.uid);
    }
    this.isEditing = false;
    this.isEditingProfileName = false;
  }


  /**
   * Passe en mode édition du nom du profil sélectionné (bascule le select vers un champ texte).
   * L'enregistrement se fait via le bouton "Enregistrer les modifications" déjà existant.
   */
  public onEditProfileNameClick(): void {
    if (!this.selectedProfile) return;
    this.isEditingProfileName = true;
  }

  /**
   * Marque le formulaire comme modifié suite à la saisie du nom du profil.
   */
  public onProfileNameInputChange(): void {
    this.isEditing = true;
  }

  /**
   * Intercepte la création d'un nouveau profil via le tableau (ng2-smart-table) :
   * auto-incrémente l'UID, applique des valeurs par défaut aux champs non affichés
   * dans le tableau, puis valide via Zod avant l'appel à l'API.
   * @param event Événement de création de ng2-smart-table
   */
  public onCreateConfirm(event: any): void {
    const newData = event.newData;

    // 1. On récupère toutes les lignes actuelles de la table pour calculer le max(uid)
    this.source.getAll().then((currentData: any[]) => {
      
      const maxUid = currentData.length > 0 
        ? Math.max(...currentData.map(item => item.uid ? Number(item.uid) : 0)) 
        : 0;
      
      // Auto-incrémentation
      newData.uid = maxUid + 1;

      // 2. Initialisation des champs masqués pour éviter que Zod ne bloque la validation
      // (Adaptez ces valeurs par défaut selon les contraintes de votre base de données)
      newData.waiting_time = 0;
      newData.menu_actif = 0;
      newData.audio_welcome = 'Aucun';
      newData.audio_waiting = 'Aucun';
      newData.audio_dissuasion = 'Aucun';
      newData.audio_closing = 'Aucun';
      newData.audio_flash = 'Aucun';
      newData.audio_exceptionnel = 'Aucun';
      newData.type_dissuasion = '';
      newData.ch1_dissuasion = '';
      newData.barrage_entrant = 'Aucun';

      // 3. Validation des données complétées avec votre schéma Zod
      const result = OrangeAviProfileSchema.safeParse(newData);

      if (result.success) {
        const validProfile: OrangeAviProfile = result.data;

        this.oapService.addOap(validProfile).subscribe({
          next: (res) => {
            event.confirm.resolve(res);
            this.profileStateService.notifyProfilesChanged();
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout du profil :", err);
            event.confirm.reject();
          }
        });
      } else {
        console.error("Erreurs de validation Zod :", result.error.format());
        alert("Données invalides. Vérifiez la console pour les détails du schéma.");
        event.confirm.reject();
      }
      
    }).catch(err => {
      console.error("Impossible de charger la source pour calculer l'UID", err);
      event.confirm.reject();
    });
  }

  /**
   * Fonction de comparaison utilisée par Angular (ex: pour les balises <select>)
   */
  compareFn(a: OrangeAviProfile | null, b: OrangeAviProfile | null): boolean {
    if (!a || !b) return false;
    return a.profile === b.profile;
  }

  /**
   * Intercepte et valide la modification d'un profil via le tableau.
   * @param event Événement d'édition de ng2-smart-table
   */
  public onEditConfirm(event: any): void {
    // Validation des nouvelles données avec Zod
    const result = OrangeAviProfileSchema.safeParse(event.newData);

    if (result.success) {
      const validProfile: OrangeAviProfile = result.data;

      this.oapService.updateOap(validProfile).subscribe({
        next: (res) => {
          event.confirm.resolve(res);
          this.loadOrangeAviProfiles();
          this.profileStateService.notifyProfilesChanged();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du profil :", err);
          event.confirm.reject();
        }
      });
    } else {
      console.error("Erreurs de validation Zod :", result.error.format());
      event.confirm.reject();
    }
  }

  /**
   * Enregistre les modifications du profil actuellement affiché (boutons du formulaire).
   */
  public onSaveClick(): void {
    if (!this.newSelectedProfile) return;

    if (!this.newSelectedProfile.profile?.trim()) {
      alert("Le nom du profil ne peut pas être vide.");
      return;
    }

    // Plusieurs colonnes sont nullable en base (description, waiting_time, audio_*,
    // type_dissuasion, ch1_dissuasion, menu_actif, barrage_entrant) mais le schéma Zod
    // attend des chaînes/nombres non-null : on comble les null avant validation.
    const dataToValidate = {
      ...this.newSelectedProfile,
      profile: this.newSelectedProfile.profile.trim(),
      description: this.newSelectedProfile.description ?? '',
      waiting_time: this.newSelectedProfile.waiting_time ?? 0,
      audio_welcome: this.newSelectedProfile.audio_welcome || 'Aucun',
      audio_waiting: this.newSelectedProfile.audio_waiting || 'Aucun',
      audio_dissuasion: this.newSelectedProfile.audio_dissuasion || 'Aucun',
      audio_closing: this.newSelectedProfile.audio_closing || 'Aucun',
      audio_flash: this.newSelectedProfile.audio_flash || 'Aucun',
      audio_exceptionnel: this.newSelectedProfile.audio_exceptionnel || 'Aucun',
      type_dissuasion: this.newSelectedProfile.type_dissuasion ?? '',
      ch1_dissuasion: this.newSelectedProfile.ch1_dissuasion ?? '',
      menu_actif: this.newSelectedProfile.menu_actif ?? 0,
      barrage_entrant: this.newSelectedProfile.barrage_entrant || 'Aucun',
    };

    const result = OrangeAviProfileSchema.safeParse(dataToValidate);

    if (result.success) {
      this.oapService.updateOap(result.data).subscribe({
        next: (updated) => {
          this.isEditing = false;
          this.isEditingProfileName = false;
          this.selectedProfile = updated;
          this.newSelectedProfile = { ...updated };
          this.loadOrangeAviProfiles();
          this.profileStateService.notifyProfilesChanged();
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du profil :", err);
          alert("Erreur lors de la mise à jour du profil.");
        }
      });
    } else {
      console.error("Erreurs de validation Zod :", result.error.format());
      alert("Données invalides. Vérifiez la console pour les détails du schéma.");
    }
  }

  /**
   * Annule les modifications en cours et restaure le profil sélectionné.
   */
  public onCancelClick(): void {
    if (this.selectedProfile) {
      this.newSelectedProfile = { ...this.selectedProfile };
    }
    this.isEditing = false;
    this.isEditingProfileName = false;
  }

  /**
   * Supprime le profil actuellement sélectionné.
   */
  public onDeleteClick(): void {
    if (!this.selectedProfile) return;

    const confirmed = confirm(`Voulez-vous vraiment supprimer le profil "${this.selectedProfile.profile}" ?`);
    if (!confirmed) return;

    this.oapService.deleteOap(this.selectedProfile.uid).subscribe({
      next: () => {
        this.selectedProfile = null;
        this.newSelectedProfile = null;
        this.isEditing = false;
        this.loadOrangeAviProfiles();
        this.profileStateService.notifyProfilesChanged();
      },
      error: (err) => {
        console.error("Erreur lors de la suppression du profil :", err);
        alert("Erreur lors de la suppression du profil. Il est peut-être encore utilisé par un préfixe.");
      }
    });
  }

  /**
   * Duplique le profil actuellement sélectionné (nom + "_copy") ainsi que tous ses horaires.
   * La duplication est faite en une seule requête côté serveur (profil + horaires
   * créés ensemble), plutôt qu'en plusieurs appels HTTP successifs depuis le client.
   */
  public onDuplicateClick(): void {
    if (!this.selectedProfile) return;

    this.oapService.duplicateOap(this.selectedProfile.uid).subscribe({
      next: (createdProfile) => this.finishDuplication(createdProfile),
      error: (err) => {
        console.error("Erreur lors de la duplication du profil :", err);
        alert("Erreur lors de la duplication du profil.");
      }
    });
  }

  /** Recharge la liste des profils, notifie les autres vues, puis sélectionne le profil dupliqué. */
  private finishDuplication(createdProfile: OrangeAviProfile): void {
    this.loadOrangeAviProfiles();
    this.profileStateService.notifyProfilesChanged();
    this.selectProfileByUid(createdProfile.uid);
  }

  // ==========================================
  // GESTION DES AUDIO OPTIONS (Événements)
  // ==========================================
  
  /**
   * Charge la liste des fichiers audio disponibles depuis le serveur
   */
  loadAudioOptions(): void {
  this.oapService.getAudioOptions().subscribe(data => {
    this.audioOptions = data;
    console.log('Options audio chargées :', this.audioOptions);
  });
}

  /** Met à jour le message d'accueil du formulaire et marque celui-ci comme modifié. */
  onAudioWelcomeChange(audioWelcome: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_welcome = audioWelcome;
    }
    this.isEditing = true;
  }

  /** Met à jour le message d'attente du formulaire et marque celui-ci comme modifié. */
  onAudioWaitingChange(audioWaiting: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_waiting = audioWaiting;
    }
    this.isEditing = true;
  }

  /** Met à jour le message de dissuasion du formulaire et marque celui-ci comme modifié. */
  onAudioDissuasionChange(audioDissuasion: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_dissuasion = audioDissuasion;
    }
    this.isEditing = true;
  }

  /** Met à jour le message de fermeture du formulaire et marque celui-ci comme modifié. */
  onAudioClosingChange(audioClosing: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_closing = audioClosing;
    }
    this.isEditing = true;
  }

  /** Met à jour le message de fermeture exceptionnelle du formulaire et marque celui-ci comme modifié. */
  onAudioExceptChange(audioExceptionnel: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_exceptionnel = audioExceptionnel;
    }
    this.isEditing = true;
  }

  /** Met à jour le message flash du formulaire et marque celui-ci comme modifié. */
  onAudioFlashChange(audioFlash: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_flash = audioFlash;
    }
    this.isEditing = true;
  }

  /** Met à jour le message de barrage entrant du formulaire et marque celui-ci comme modifié. */
  onBarrageChange(barrageEntrant: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.barrage_entrant = barrageEntrant;
    }
    this.isEditing = true;
  }

  /** Met à jour le type de dissuasion du formulaire et marque celui-ci comme modifié. */
  onTypeDissuasionChange(typeDissuasion: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.type_dissuasion = typeDissuasion;
    }
    this.isEditing = true;
  }

  /** Marque le formulaire comme modifié suite à la saisie du champ "Ch1 dissuasion". */
  onCh1DissuasionChange(): void {
    this.isEditing = true;
  }

  /** `true` si le SVI (menu vocal) est activé pour le profil en cours d'édition. */
  get sviActif(): boolean {
    return !!this.newSelectedProfile?.menu_actif;
  }

  /** Active/désactive le SVI du profil en cours d'édition (case à cocher "Activer le SVI"). */
  onSviActifChange(checked: boolean): void {
    if (this.newSelectedProfile) {
      this.newSelectedProfile.menu_actif = checked ? 1 : 0;
    }
    this.isEditing = true;
  }

  /**
   * Ouvre la modale du SVI ({@link OrangeAviSviComponent}) pour visualiser/éditer
   * le menu vocal du profil actuellement sélectionné.
   */
  public onVoirSviClick(): void {
    if (!this.selectedProfile) return;
    this.dialogService.open(OrangeAviSviComponent, {
      context: {
        profile: this.selectedProfile,
      },
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });
  }


  // ==========================================
  // Actions de Navigation / Événements utilisateur
  // ==========================================

  /**
   * Gère les actions personnalisées du tableau (ex: Clic sur l'icône Œil).
   * @param event Événement d'action personnalisée de ng2-smart-table
   */
  public onCustom(event: any): void {
    if (event.action === 'viewProfile') {
      console.log('Profil sélectionné via l\'œil :', event.data);

      // Met à jour l'état partagé du profil et force le changement d'onglet (true)
      this.profileStateService.changeProfile(event.data, true);
    }
  }
}