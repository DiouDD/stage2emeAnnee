import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import { ProfileStateService } from './profile_state.service';
import { OrangeAviProfile, OrangeAviProfileSchema } from './orange_avi_profile.model';

@Component({
  selector: 'ngx-orange-avi-profile',
  templateUrl: './orange_avi_profile.component.html',
  styleUrls: ['./orange_avi_profile.component.scss']
})
export class OrangeAviProfileComponent implements OnInit {

  // ==========================================
  // Propriétés / Propriétés de configuration
  // ==========================================

  /** Source de données locale pour la table intelligente */
  public source: LocalDataSource = new LocalDataSource();
  selectedProfile: OrangeAviProfile | null = null;
  profiles: OrangeAviProfile[] = [];  
  newSelectedProfile: OrangeAviProfile | null = null;
  isEditing: boolean = false;  
  audioOptions: string[] = [];
  selectedProfileId: number = 1;

  // ==========================================
  // Constructeur & Cycles de vie
  // ==========================================

  constructor(
    private oapService: OrangeAviProfileService,
    private profileStateService: ProfileStateService
  ) {}

  /**
   * Initialisation du composant.
   */
  ngOnInit(): void {
    this.loadOrangeAviProfiles();
    this.loadAudioOptions();
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

        // Sélection automatique du premier profil au démarrage
        if (data.length > 0 && !this.selectedProfile) {
          this.selectedProfile = data[0];
          this.newSelectedProfile = { ...data[0] };
          console.log('Profil chargé :', this.newSelectedProfile);
          this.onProfileSelected(data[0].uid);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des profils :', err);
      }
    });
  }

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
  }


  /**
   * Intercepte et valide la création d'un nouveau profil via le tableau.
   * @param event Événement de création de ng2-smart-table
   */
  /**
   * Intercepte, auto-incrémente l'UID, applique des valeurs par défaut et valide via Zod.
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
      newData.audio_welcome = '';
      newData.audio_waiting = '';
      newData.audio_dissuasion = '';
      newData.audio_closing = '';
      newData.audio_flash = '';
      newData.audio_exceptionnel = '';
      newData.type_dissuasion = '';
      newData.ch1_dissuasion = '';
      newData.barrage_entrant = '';

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

    // Plusieurs colonnes sont nullable en base (description, waiting_time, audio_*,
    // type_dissuasion, ch1_dissuasion, menu_actif, barrage_entrant) mais le schéma Zod
    // attend des chaînes/nombres non-null : on comble les null avant validation.
    const dataToValidate = {
      ...this.newSelectedProfile,
      description: this.newSelectedProfile.description ?? '',
      waiting_time: this.newSelectedProfile.waiting_time ?? 0,
      audio_welcome: this.newSelectedProfile.audio_welcome ?? '',
      audio_waiting: this.newSelectedProfile.audio_waiting ?? '',
      audio_dissuasion: this.newSelectedProfile.audio_dissuasion ?? '',
      audio_closing: this.newSelectedProfile.audio_closing ?? '',
      audio_flash: this.newSelectedProfile.audio_flash ?? '',
      audio_exceptionnel: this.newSelectedProfile.audio_exceptionnel ?? '',
      type_dissuasion: this.newSelectedProfile.type_dissuasion ?? '',
      ch1_dissuasion: this.newSelectedProfile.ch1_dissuasion ?? '',
      menu_actif: this.newSelectedProfile.menu_actif ?? 0,
      barrage_entrant: this.newSelectedProfile.barrage_entrant ?? '',
    };

    const result = OrangeAviProfileSchema.safeParse(dataToValidate);

    if (result.success) {
      this.oapService.updateOap(result.data).subscribe({
        next: () => {
          this.isEditing = false;
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

  onAudioWelcomeChange(audioWelcome: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_welcome = audioWelcome;
    }
    this.isEditing = true;
  }

  onAudioWaitingChange(audioWaiting: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_waiting = audioWaiting;
    }
    this.isEditing = true;
  }

  onAudioDissuasionChange(audioDissuasion: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_dissuasion = audioDissuasion;
    }
    this.isEditing = true;
  }

  onAudioClosingChange(audioClosing: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_closing = audioClosing;
    }
    this.isEditing = true;
  }

  onAudioExceptChange(audioExceptionnel: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_exceptionnel = audioExceptionnel;
    }
    this.isEditing = true;
  }

  onAudioFlashChange(audioFlash: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.audio_flash = audioFlash;
    }
    this.isEditing = true;
  }

  onBarrageChange(barrageEntrant: string): void {
    if (this.selectedProfile && this.newSelectedProfile) {
      this.newSelectedProfile.barrage_entrant = barrageEntrant;
    }
    this.isEditing = true;
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