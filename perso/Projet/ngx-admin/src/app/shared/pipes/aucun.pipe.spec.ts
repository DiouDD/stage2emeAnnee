import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AucunPipe } from './aucun.pipe';

@NgModule({
  declarations: [AucunPipe],
  imports: [CommonModule],
  exports: [AucunPipe]  // Important : exporter pour utiliser ailleurs
})
export class SharedModule { }