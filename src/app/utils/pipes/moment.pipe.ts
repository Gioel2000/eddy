import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'moment',
  standalone: true,
})
export class MomentPipe implements PipeTransform {
  transform(value: any, locale: string, format: string = 'ddd DD MMM YYYY'): any {
    if (!value) return '';
    if (!locale) return moment(value).format(format);

    return moment(value).locale(locale).format(format);
  }
}
