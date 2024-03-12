import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'isBetweenDay',
  standalone: true,
})
export class IsBetweenDayPipe implements PipeTransform {
  transform(date: Date, start: Date, end: Date): boolean {
    return moment(date).isBetween(start, end, 'day', '[]');
  }
}
