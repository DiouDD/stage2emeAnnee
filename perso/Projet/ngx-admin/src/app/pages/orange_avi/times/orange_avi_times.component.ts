import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrangeAviTimesService } from './orange_avi_times.service';
import { OrangeAviTimes } from './orange_avi_times.model';
import { OrangeAviProfileService } from '../profile/orange_avi_profile.service';
import { OrangeAviProfile } from '../profile/orange_avi_profile.model';
import { ProfileStateService } from '../profile/profile_state.service';

@Component({
  selector: 'ngx-orange-avi-times',
  templateUrl: './orange_avi_times.component.html',
  styleUrls: ['./orange_avi_times.component.scss']
})
export class OrangeAviTimesComponent implements OnInit {

  // ==========================================
  // PROPRIÉTÉS ET ETATS
  // ==========================================
  source: LocalDataSource = new LocalDataSource();
  @Input() selectedProfileId: number = 1;    // Profil actif actuellement affiché
  selectedProfileTimes: OrangeAviTimes[] = [];         // Horaires associés au profil sélectionné

  // Configuration des jours de la semaine
  jourDeLaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Formulaire d'ajout / édition d'un horaire (Valeurs par défaut)
  newTime: OrangeAviTimes | null = null; 
  newTimeDay: string = 'Lundi'; 
  newTimeOpening: string = '08:30'; 
  newTimeClosing: string = '11:00'; 

  // États de modification
  editingTimeId: any = null;                           // UID de l'horaire en cours d'édition (null si aucun)
  isEditing: boolean = false;                           // Indique si le profil général a été modifié

  constructor(
    private oatService: OrangeAviTimesService, 
    private oapService: OrangeAviProfileService, 
    private profileStateService: ProfileStateService
  ) {}
    
  // ==========================================
  // CYCLE DE VIE
  // ==========================================
  ngOnInit(): void {
    this.loadOrangeAviTime(this.selectedProfileId);
    this.isEditing = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProfileId'] && !changes['selectedProfileId'].firstChange) {
      this.loadOrangeAviTime(this.selectedProfileId);
    }
  }

  // ==========================================
  // GESTION DES PROFILS (CRUD & Sélection)
  // ==========================================

  /**
   * Déclenché lors du changement manuel de profil via la liste déroulante (select)
   */
  onProfileChange(newProfileId: number): void {
  if (newProfileId != this.selectedProfileId) {
    this.selectedProfileId = newProfileId;
    this.loadOrangeAviTime(newProfileId);
  }
}

  // ==========================================
  // GESTION DES HORAIRES (Times CRUD)
  // ==========================================

  /**
   * Charge la liste des plages horaires rattachées à un profil spécifique
   */
  loadOrangeAviTime(id_profile: number | null): void {
    console.log('Chargement pour le profil :', id_profile);
    if (id_profile != null) {
      this.oatService.getOatsById(id_profile).subscribe(data => {
        console.log('Données reçues :', data);
        this.selectedProfileTimes = Array.isArray(data) ? data : [data];
      });
    }
  }

  /**
   * Ajoute un nouvel horaire via le formulaire personnalisé du bas
   */
  onAddTime(): void {
    if (!this.selectedProfileId) {
      alert("Veuillez sélectionner un profil avant d'ajouter un horaire.");
      return;
    }

    const dayIndex = parseInt(this.newTimeDay, 10);

    const timeToTemplate = {
      profileUid: this.selectedProfileId,
      day: new Date(),
      dow: dayIndex,
      opening_time: this.newTimeOpening,
      closing_time: this.newTimeClosing
    };

    this.oatService.addOat(timeToTemplate as any).subscribe({
      next: (createdOat) => {
        console.log("Nouvel horaire ajouté avec succès :", createdOat);
        
        if (this.selectedProfileId) {
          this.loadOrangeAviTime(this.selectedProfileId);
        }

        // Réinitialisation du formulaire aux valeurs par défaut
        this.newTimeDay = 'Lundi';
        this.newTimeOpening = '08:30';
        this.newTimeClosing = '11:00';
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de l'horaire :", err);
        alert("Une erreur est survenue lors de l'enregistrement de l'horaire.");
      }
    });
  }

  /**
   * Bascule l'interface du formulaire en mode édition et y injecte l'horaire sélectionné
   */
  onSelectTimeToEdit(time: OrangeAviTimes): void {
    this.editingTimeId = time.uid;
    this.newTimeDay = time.dow.toString();
    this.newTimeOpening = time.opening_time;
    this.newTimeClosing = time.closing_time;
  }

  /**
   * Soumet les modifications d'un horaire existant à l'API
   */
  onUpdateTime(): void {
    if (!this.selectedProfileId || !this.editingTimeId) return;

    const dayIndex = parseInt(this.newTimeDay, 10);
    const updatedTime = {
      uid: this.editingTimeId,
      profileUid: this.selectedProfileId,
      day: new Date(),
      dow: dayIndex,
      opening_time: this.newTimeOpening,
      closing_time: this.newTimeClosing
    };

    this.oatService.updateOat(updatedTime as any).subscribe({
      next: (res) => {
        console.log("Horaire mis à jour avec succès :", res);
        
        if (this.selectedProfileId) {
          this.loadOrangeAviTime(this.selectedProfileId);
        }
        
        this.onCancelEditTime(); // Fermeture et reset du formulaire
      },
      error: (err) => {
        console.error("Erreur lors de la modification :", err);
        alert("Une erreur est survenue lors de la modification de l'horaire.");
      }
    });
  }

  /**
   * Annule l'édition d'un horaire et vide le formulaire
   */
  onCancelEditTime(): void {
    this.editingTimeId = null;
    this.newTimeDay = '1';
    this.newTimeOpening = '';
    this.newTimeClosing = '';
  }

  /**
   * Supprime un horaire via son UID depuis le formulaire personnalisé
   */
  onDeleteTime(uid: number): void {
    if (window.confirm("Voulez-vous vraiment supprimer cet horaire ?")) {
      this.oatService.deleteOat(uid).subscribe({
        next: () => {
          console.log(`Horaire avec l'UID ${uid} supprimé avec succès.`);
          if (this.selectedProfileId) {
            this.loadOrangeAviTime(this.selectedProfileId);
          }
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de l'horaire :", err);
          alert("Une erreur est survenue lors de la suppression de l'horaire.");
        }
      });
    }
  }

  // ==========================================
  // COMPATIBILITÉ SMART-TABLE (Inline CRUD Events)
  // ==========================================
  
  /**
   * Ajout natif via les boutons d'action intégrés de ng2-smart-table
   */
  onCreateConfirm(event: any): void {
    this.oatService.addOat(event.newData).subscribe({
      next: (newOat) => event.confirm.resolve(newOat),
      error: () => event.confirm.reject()
    });
  }

  /**
   * Suppression native via les boutons d'action intégrés de ng2-smart-table
   */
  onDeleteConfirm(event: any): void {  
    if (window.confirm('Voulez-vous vraiment supprimer le profil ainsi que tous ses horaires ?')) {
      this.oatService.deleteOat(event.data.uid).subscribe({
        next: () => event.confirm.resolve(),
        error: () => event.confirm.reject()
      });
    } else {
      event.confirm.reject();
    }
  }
}