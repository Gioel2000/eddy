import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'growthPercentage',
  standalone: true,
})
export class GrowthPercentagePipe implements PipeTransform {
  transform(value: number, lang: string, maximumFractionDigits?: number): string {
    const valueFormatted = value
      ? new Intl.NumberFormat(lang, { maximumFractionDigits: maximumFractionDigits }).format(value)
      : '0';
    return value > 0 ? `+${valueFormatted}%` : value < 0 ? `${valueFormatted}%` : `${valueFormatted}%`;
  }
}
