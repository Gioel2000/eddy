import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'monthName',
  standalone: true,
})
export class MonthNamePipe implements PipeTransform {
  transform(month: number, locale: string, format?: string): any {
    return moment()
      .locale(locale)
      .month(month)
      .format(format || 'MMMM');
  }
}
