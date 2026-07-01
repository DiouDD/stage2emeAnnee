import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClientService } from './client.service';

@Component({
  selector: 'ngx-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

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
      nom: { title: 'Nom', type: 'string' },
      prenom: { title: 'Prénom', type: 'string' },
      telephone: { title: 'Téléphone', type: 'string' }
    },
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(data => {
      this.source.load(data);
    });
  }

  onCreateConfirm(event: any): void {
    this.clientService.addClient(event.newData).subscribe({
      next: (newClient) => {
        event.confirm.resolve(newClient);
      },
      error: () => event.confirm.reject()
    });
  }

  onEditConfirm(event: any): void {
    const updatedClient = { ...event.data, ...event.newData };
    
    this.clientService.updateClient(updatedClient).subscribe({
      next: () => {
        event.confirm.resolve(updatedClient);
      },
      error: () => event.confirm.reject()
    });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(event.data.id).subscribe({
        next: () => {
          event.confirm.resolve();
        },
        error: () => event.confirm.reject()
      });
    } else {
      event.confirm.reject();
    }
  }
}