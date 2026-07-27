import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrangeAviTimesService } from './orange_avi_times.service';
import { OrangeAviTimes } from './orange_avi_times.model';

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

  // Horaires exceptionnels (dow = 0 : date précise plutôt qu'un jour de la semaine récurrent)
  get exceptionTimes(): OrangeAviTimes[] {
    return this.selectedProfileTimes.filter(time => time.dow === 0);
  }

  // Horaires récurrents (dow != 0 : jour de la semaine, à exclure des exceptions)
  get regularTimes(): OrangeAviTimes[] {
    return this.selectedProfileTimes.filter(time => time.dow !== 0);
  }

  // Formulaire d'ajout / édition d'un horaire (Valeurs par défaut)
  newTime: OrangeAviTimes | null = null;
  newTimeDay: string = 'Lundi';
  newTimeOpening: string = '08:30';
  newTimeClosing: string = '11:00';

  // États de modification
  editingTimeId: any = null;                           // UID de l'horaire en cours d'édition (null si aucun)
  isEditing: boolean = false;                           // Indique si le profil général a été modifié

  // Formulaire d'ajout / édition d'une exception (Valeurs par défaut : dow = 0, horaires à 00:00)
  newExceptionDate: Date = new Date();
  newExceptionOpening: string = '00:00';
  newExceptionClosing: string = '00:00';

  // État de modification
  editingExceptionId: any = null;                       // UID de l'exception en cours d'édition (null si aucune)

  constructor(
    private oatService: OrangeAviTimesService
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
      day: new Date('1970-01-01T01:00:00'),
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
      day: new Date('1970-01-01T01:00:00'),
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
  // GESTION DES EXCEPTIONS (Exceptions CRUD)
  // ==========================================

  /**
   * Ajoute une nouvelle exception (horaire ponctuel pour une date précise, dow = 0)
   */
  onAddException(): void {
    if (!this.selectedProfileId) {
      alert("Veuillez sélectionner un profil avant d'ajouter une exception.");
      return;
    }

    const exceptionToTemplate = {
      profileUid: this.selectedProfileId,
      day: this.newExceptionDate,
      dow: 0,
      opening_time: this.newExceptionOpening,
      closing_time: this.newExceptionClosing
    };

    this.oatService.addOat(exceptionToTemplate as any).subscribe({
      next: (createdOat) => {
        console.log("Nouvelle exception ajoutée avec succès :", createdOat);

        if (this.selectedProfileId) {
          this.loadOrangeAviTime(this.selectedProfileId);
        }

        // Réinitialisation du formulaire aux valeurs par défaut
        this.newExceptionDate = new Date();
        this.newExceptionOpening = '00:00';
        this.newExceptionClosing = '00:00';
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de l'exception :", err);
        alert("Une erreur est survenue lors de l'enregistrement de l'exception.");
      }
    });
  }

  /**
   * Bascule l'interface du formulaire en mode édition et y injecte l'exception sélectionnée
   */
  onSelectExceptionToEdit(time: OrangeAviTimes): void {
    this.editingExceptionId = time.uid;
    this.newExceptionDate = new Date(time.day);
    this.newExceptionOpening = time.opening_time;
    this.newExceptionClosing = time.closing_time;
  }

  /**
   * Soumet les modifications d'une exception existante à l'API
   */
  onUpdateException(): void {
    if (!this.selectedProfileId || !this.editingExceptionId) return;

    const updatedException = {
      uid: this.editingExceptionId,
      profileUid: this.selectedProfileId,
      day: this.newExceptionDate,
      dow: 0,
      opening_time: this.newExceptionOpening,
      closing_time: this.newExceptionClosing
    };

    this.oatService.updateOat(updatedException as any).subscribe({
      next: (res) => {
        console.log("Exception mise à jour avec succès :", res);

        if (this.selectedProfileId) {
          this.loadOrangeAviTime(this.selectedProfileId);
        }

        this.onCancelEditException(); // Fermeture et reset du formulaire
      },
      error: (err) => {
        console.error("Erreur lors de la modification de l'exception :", err);
        alert("Une erreur est survenue lors de la modification de l'exception.");
      }
    });
  }

  /**
   * Annule l'édition d'une exception et vide le formulaire
   */
  onCancelEditException(): void {
    this.editingExceptionId = null;
    this.newExceptionDate = new Date();
    this.newExceptionOpening = '00:00';
    this.newExceptionClosing = '00:00';
  }

  
  /**
   * Supprime une exception via son UID
   */
  onDeleteException(uid: number): void {
    if (window.confirm("Voulez-vous vraiment supprimer cette exception ?")) {
      this.oatService.deleteOat(uid).subscribe({
        next: () => {
          console.log(`Exception avec l'UID ${uid} supprimée avec succès.`);
          if (this.selectedProfileId) {
            this.loadOrangeAviTime(this.selectedProfileId);
          }
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de l'exception :", err);
          alert("Une erreur est survenue lors de la suppression de l'exception.");
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