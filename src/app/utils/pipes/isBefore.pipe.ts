import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'isBefore',
  standalone: true,
})
export class IsBeforePipe implements PipeTransform {
  transform(date: Date, start: Date): boolean {
    return moment(date).isBefore(start);
  }
}
