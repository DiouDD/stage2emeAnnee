import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrangeAviModule } from './orange_avi/orange_avi.module';

@NgModule({
  imports: [
    NbCardModule,
    Ng2SmartTableModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    OrangeAviModule,
    NbIconModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
