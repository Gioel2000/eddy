import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'isSameDay',
  standalone: true,
})
export class IsSameDayPipe implements PipeTransform {
  transform(date: Date, date2: Date): boolean {
    return moment(date).isSame(date2, 'day');
  }
}
