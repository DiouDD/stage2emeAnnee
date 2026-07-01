import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aucun',
})
export class AucunPipe implements PipeTransform {
  transform(value: any): string {
    return value === null || value === undefined || value === '' ? 'Aucun' : value;
  }
}