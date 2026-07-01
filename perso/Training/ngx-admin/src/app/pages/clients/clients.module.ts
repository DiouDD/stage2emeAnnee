import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClientsComponent } from './clients.component';


@NgModule({
  declarations: [
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbButtonModule,
    NbInputModule
  ],
  exports: [
    ClientsComponent
  ]
})
export class ClientsModule { }