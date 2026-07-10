import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { OrangeAviPrefixeComponent } from './prefixe/orange_avi_prefixe.component';
import { OrangeAviComponent } from './orange_avi.component';
import { OrangeAviProfileComponent } from './profile/orange_avi_profile.component';
import { NbTabsetModule } from '@nebular/theme';
import { NbSelectModule } from '@nebular/theme';
import { NbCheckboxModule } from '@nebular/theme';
import { NbDatepickerModule } from '@nebular/theme';
import { OrangeAviTimesComponent } from './times/orange_avi_times.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/pipes/aucun.pipe.spec';
import { Ng2CompleterModule } from "ng2-completer";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbTabsetModule,
    NbSelectModule,
    NbCheckboxModule,
    NbDatepickerModule,
    SharedModule,
    NbButtonModule,
    NbIconModule,
    Ng2CompleterModule
],
    declarations: [
    OrangeAviTimesComponent,
    OrangeAviPrefixeComponent,
    OrangeAviProfileComponent,
    OrangeAviComponent,
    OrangeAviTimesComponent
  ],
  
})
export class OrangeAviModule { }