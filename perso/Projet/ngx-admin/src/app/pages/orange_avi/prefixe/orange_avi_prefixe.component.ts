import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrangeAviPrefixeService } from './orange_avi_prefixe.service';
import { OrangeAviPrefixe } from './orange_avi_prefixe.model';
import { OrangeAviProfile } from '../profile/orange_avi_profile.model';

@Component({
  selector: 'ngx-orange-avi-prefixe',
  templateUrl: './orange_avi_prefixe.component.html',
  styleUrls: ['./orange_avi_prefixe.component.scss']
})
export class OrangeAviPrefixeComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();

  settings = {
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
      profile: { title: 'Profile', type: 'string', valuePrepareFunction: (profile : OrangeAviProfile) => { return profile ? profile.profile : ''; }},
    },
  };

  constructor(private oapService: OrangeAviPrefixeService) {}

  ngOnInit(): void {
    this.loadOrangeAviPrefixe();
  }

  // Charger tout les prefixe depuis la base de données
  loadOrangeAviPrefixe(): void {
    this.oapService.getOaps().subscribe(data => {
      this.source.load(data);
    });
  }

  // Permet de créer un nouveau prefixe et de l'ajouter dans la BDD
  onCreateConfirm(event: any): void {
    const payload: OrangeAviPrefixe = {
      ...event.newData,
      uid: Number(event.data.uid),
      id_profile: Number(event.newData.id_profile),
      code_campagne: Number(event.newData.code_campagne)
    };

    this.oapService.addOap(payload).subscribe({
      next: (newOap) => event.confirm.resolve(newOap),
      error: () => event.confirm.reject()
    });
  }

  onEditConfirm(event: any): void {
    const payload: OrangeAviPrefixe = {
      ...event.newData,
      uid: Number(event.newData.uid),
      id_profile: Number(event.newData.id_profile),
      code_campagne: Number(event.newData.code_campagne)
    };

    this.oapService.updateOap(payload).subscribe({
      next: (updatedOap) => event.confirm.resolve(updatedOap),
      error: () => event.confirm.reject()
    });
  }

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
