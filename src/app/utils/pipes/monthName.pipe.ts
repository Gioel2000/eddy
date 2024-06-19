import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'monthName',
  standalone: true,
})
export class MonthNamePipe implements PipeTransform {
  transform(month: number, locale: string, format?: string): any {
    if (!month) return '';
    if (!locale)
      return moment()
        .month(month)
        .format(format || 'MMMM');
    return moment()
      .locale(locale)
      .month(month)
      .format(format || 'MMMM');
  }
}
