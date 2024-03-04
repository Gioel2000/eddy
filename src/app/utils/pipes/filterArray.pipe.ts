import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
  standalone: true,
})
export class FilterArrayPipe implements PipeTransform {
  transform(array: any[], column: string, value: any): any[] {
    if (!array || !column || !value) {
      return array;
    }

    return array.filter((item) => item[column] === value);
  }
}
