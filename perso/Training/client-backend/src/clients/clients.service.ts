import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from './interfaces/client.interface';

@Injectable()
export class ClientsService {
  private clients: Client[] = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', telephone: '0102030405' },
    { id: 2, nom: 'Durand', prenom: 'Marie', telephone: '0607080910' },
  ];

  findAll(): Client[] {
    return this.clients;
  }

  findOne(id: number): Client {
    const client = this.clients.find((c) => c.id === id);
    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} introuvable`);
    }
    return client;
  }

  create(client: Omit<Client, 'id'>): Client {
    let newId: number;
    if (this.clients.length > 0) {
      // Le tableau n'est pas vide, on cherche le max et on fait +1
      const tousLesIds = this.clients.map((c) => c.id);
      const idLePlusGrand = Math.max(...tousLesIds);
      newId = idLePlusGrand + 1;
    } else {
      // Le tableau est vide, on commence à 1
      newId = 1;
    }
    const newClient = { id: newId, ...client };
    this.clients.push(newClient);
    return newClient;
  }

  update(id: number, updatedFields: Partial<Client>): Client {
    const client = this.findOne(id);
    const index = this.clients.findIndex((c) => c.id === id);
    this.clients[index] = { ...client, ...updatedFields };
    return this.clients[index];
  }

  delete(id: number): void {
    this.findOne(id);
    this.clients = this.clients.filter((c) => c.id !== id);
  }
}
