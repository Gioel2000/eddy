import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'toDate',
  standalone: true,
})
export class ToDatePipe implements PipeTransform {
  transform(value: string): any {
    return moment(value).toDate();
  }
}
