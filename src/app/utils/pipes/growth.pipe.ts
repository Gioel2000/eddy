import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'growth',
  standalone: true,
})
export class GrowthPipe implements PipeTransform {
  transform(value: number, lang: string, maximumFractionDigits?: number): string {
    const amount = Math.pow(10, maximumFractionDigits || 0);
    const rounded = maximumFractionDigits ? Math.round(value * amount) / amount : Math.round(value * 10) / 10;

    if (rounded === 0 && value !== 0 && !maximumFractionDigits) return '';

    const valueFormatted = new Intl.NumberFormat(lang).format(rounded);

    return value > 0 ? `+${valueFormatted}` : value < 0 ? `${valueFormatted}` : `${valueFormatted}`;
  }
}
