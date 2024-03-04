import { Pipe, PipeTransform } from '@angular/core';
import moment, { DurationInputArg1, DurationInputArg2 } from 'moment';

@Pipe({
  name: 'subtract',
  standalone: true,
})
export class SubtractPipe implements PipeTransform {
  transform(date: Date, amount: DurationInputArg1, unit: DurationInputArg2): any {
    return moment(date).subtract(amount, unit).toDate();
  }
}
