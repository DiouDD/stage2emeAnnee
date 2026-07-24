import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrangeAviPrefixeService } from './orange_avi_prefixe.service';
import { OrangeAviPrefixe } from './orange_avi_prefixe.model';
import { OrangeAviProfile } from '../profile/orange_avi_profile.model';
import { OrangeAviProfileService } from '../profile/orange_avi_profile.service';
import { ProfileStateService } from '../profile/profile_state.service';

/**
 * Onglet "Préfixes" de la fonctionnalité Orange AVI.
 *
 * Affiche la table (ng2-smart-table) des préfixes/DNIS/SDA de campagne
 * ({@link OrangeAviPrefixe}) et permet de les créer/éditer/supprimer, ainsi
 * que d'associer chaque préfixe à un {@link OrangeAviProfile} via la colonne
 * "Profile" (liste déroulante alimentée par {@link loadProfiles}).
 *
 * Se synchronise avec l'onglet "Modifier le profil" via {@link ProfileStateService} :
 * un clic sur une ligne ayant un profil associé (voir {@link onRowSelect}) sélectionne
 * ce profil et bascule automatiquement vers cet onglet.
 */
@Component({
  selector: 'ngx-orange-avi-prefixe',
  templateUrl: './orange_avi_prefixe.component.html',
  styleUrls: ['./orange_avi_prefixe.component.scss']
})
export class OrangeAviPrefixeComponent implements OnInit {

  /** Source de données locale (ng2-smart-table) chargée depuis l'API des préfixes. */
  source: LocalDataSource = new LocalDataSource();

  /** Liste des profils disponibles, utilisée pour peupler la liste déroulante de la colonne "Profile". */
  profiles: OrangeAviProfile[] = [];

  /** Configuration de la table (colonnes, boutons add/edit/delete), reconstruite à chaque chargement des profils. */
  settings: any;

  constructor(
    private oapService: OrangeAviPrefixeService,
    private profileService: OrangeAviProfileService,
    private profileStateService: ProfileStateService,
  ) {
    this.settings = this.buildSettings();
  }

  ngOnInit(): void {
    this.loadOrangeAviPrefixe();
    this.loadProfiles();
  }

  /**
   * Construit la configuration de ng2-smart-table (colonnes, actions add/edit/delete).
   * Doit être rappelée après tout chargement de {@link profiles} car la liste des
   * options du sélecteur "Profile" est figée au moment de la construction.
   */
  private buildSettings(): any {
    return {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        dnis: { title: 'dnis', type: 'string' },
        sda: { title: 'sda', type: 'string' },
        campagne: { title: 'campagne', type: 'string' },
        code_campagne: { title: 'code_campagne', type: 'number' },
        customer: { title: 'Client', type: 'string' },
        profile: {
          title: 'Profile',
          type: 'html',
          valuePrepareFunction: (profile: OrangeAviProfile) => {
            return profile
              ? `<span class="profile-link" title="Voir le profil"><i class="nb-eye"></i> ${profile.profile}</span>`
              : '';
          },
          editor: {
            type: 'list',
            config: {
              list: [
                { value: '', title: '— Aucun —' },
                ...this.profiles.map(p => ({ value: p.profile, title: p.profile })),
              ],
            },
          },
        },
      },
    };
  }

  /** Charge tous les préfixes depuis la base de données et alimente {@link source}. */
  loadOrangeAviPrefixe(): void {
    this.oapService.getOaps().subscribe(data => {
      this.source.load(data);
    });
  }

  /** Charge les profils disponibles pour la liste déroulante de la colonne "Profile". */
  loadProfiles(): void {
    this.profileService.getOaps().subscribe(profiles => {
      this.profiles = profiles;
      this.settings = this.buildSettings();
    });
  }

  /**
   * Résout l'uid du profil à partir de la valeur du champ "profile" du formulaire :
   * soit l'objet profil d'origine (champ non modifié), soit le nom choisi dans la liste déroulante.
   * @param profileValue Valeur brute du champ "profile" telle que fournie par ng2-smart-table.
   * @returns L'uid du profil correspondant, ou `undefined` si aucun profil n'est sélectionné/trouvé.
   */
  private resolveProfileUid(profileValue: any): number | undefined {
    if (!profileValue) {
      return undefined;
    }
    if (typeof profileValue === 'object') {
      return profileValue.uid;
    }
    const found = this.profiles.find(p => p.profile === profileValue);
    return found ? found.uid : undefined;
  }

  /**
   * Intercepte la création d'un nouveau préfixe via le tableau (ng2-smart-table) :
   * construit le payload (avec `profileUid` résolu depuis la liste déroulante) et
   * l'envoie à l'API.
   * @param event Événement de création de ng2-smart-table.
   */
  onCreateConfirm(event: any): void {
    // On récupère le profileUid à partir du profil choisi dans la liste déroulante
    const profileUid = this.resolveProfileUid(event.newData.profile);

    // On crée le payload en incluant directement profileUid de manière conditionnelle
    const payload = {
      dnis: event.newData.dnis?.trim(),
      sda: event.newData.sda?.trim(),
      campagne: event.newData.campagne?.trim(),
      code_campagne: Number(event.newData.code_campagne),
      customer: event.newData.customer?.trim(),
      // On l'ajoute s'il est présent, sinon on met undefined pour que Zod l'ignore (puisqu'il est .optional())
      profileUid: profileUid ? Number(profileUid) : undefined,
    };

    // On envoie le payload propre au service
    this.oapService.addOap(payload as any).subscribe({
      next: (newOap) => {
        event.confirm.resolve(newOap);
      },
      error: (err) => {
        console.error("Erreur lors de la création :", err.error);
        alert("Une erreur est survenue lors de l'ajout.");
        event.confirm.reject();
      }
    });
  }

  /**
   * Intercepte la modification d'un préfixe via le tableau (ng2-smart-table).
   * `''` (option "— Aucun —") délie explicitement le profil associé (envoi de `null`).
   * @param event Événement d'édition de ng2-smart-table.
   */
  onEditConfirm(event: any): void {
    // On récupère le profileUid à partir du profil choisi dans la liste déroulante.
    // '' correspond à l'option "Aucun" : on envoie explicitement null pour délier le profil.
    const rawProfile = event.newData.profile;
    const profileUid = rawProfile === '' ? null : this.resolveProfileUid(rawProfile);

    const payload: Partial<OrangeAviPrefixe> & { profileUid?: number | null } = {
      dnis: event.newData.dnis,
      sda: event.newData.sda,
      campagne: event.newData.campagne,
      code_campagne: Number(event.newData.code_campagne),
      customer: event.newData.customer,
      profileUid,
    };

    this.oapService.updateOap({ ...payload, uid: Number(event.newData.uid) } as OrangeAviPrefixe).subscribe({
      next: (updatedOap) => event.confirm.resolve(updatedOap),
      error: (err) => {
        console.error('Erreur de validation lors de la modification :', err.error);
        if (err.error?.errors) {
          const messages = err.error.errors
            .map((e: any) => `${e.path}: ${e.message}`)
            .join('\n');
          alert(`Modification refusée :\n${messages}`);
        } else {
          alert("Une erreur est survenue lors de la modification.");
        }
        event.confirm.reject();
      }
    });
  }

  // Clic sur une ligne du tableau : si elle a un profile associé, on l'ouvre
  // dans l'onglet "Modifier le profil".
  onRowSelect(event: any): void {
    const profile: OrangeAviProfile | undefined = event?.data?.profile;
    if (profile) {
      this.profileStateService.changeProfile(profile, true);
    }
  }

  /**
   * Intercepte la suppression d'un préfixe via le tableau (ng2-smart-table),
   * après confirmation par l'utilisateur.
   * @param event Événement de suppression de ng2-smart-table.
   */
  onDeleteConfirm(event: any): void {
    if (window.confirm('Voulez-vous vraiment supprimer ?')) {
      this.oapService.deleteOap(event.data.uid).subscribe({
        next: () => event.confirm.resolve(),
        error: () => event.confirm.reject()
      });
    } else {
      event.confirm.reject();
    }
  }
}
