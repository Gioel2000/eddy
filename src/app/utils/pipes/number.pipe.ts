import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numb',
  standalone: true,
})
export class NumberPipe implements PipeTransform {
  transform(value: number, lang: string, maximumFractionDigits?: number): string {
    if (isNaN(value)) return '0';
    return new Intl.NumberFormat(lang, { maximumFractionDigits: maximumFractionDigits }).format(value);
  }
}
