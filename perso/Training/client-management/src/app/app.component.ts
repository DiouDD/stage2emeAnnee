import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from './services/client.service';
import { Client } from './models/clients.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  clients: Client[] = [];
  clientForm!: FormGroup;
  isEditing = false;
  currentClientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required]
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      return;
    }

    const clientData: Client = this.clientForm.value;

    if (this.isEditing && this.currentClientId !== undefined) {
      clientData.id = this.currentClientId;
      this.clientService.updateClient(clientData).subscribe(() => {
        this.loadClients();
        this.resetForm();
      });
    } else {
      this.clientService.addClient(clientData).subscribe(() => {
        this.loadClients();
        this.resetForm();
      });
    }
  }

  editClient(client: Client): void {
    this.isEditing = true;
    this.currentClientId = client.id;
    this.clientForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      telephone: client.telephone
    });
  }

  deleteClient(id?: number): void {
    if (id !== undefined) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
      });
    }
  }

  resetForm(): void {
    this.clientForm.reset();
    this.isEditing = false;
    this.currentClientId = undefined;
  }
}