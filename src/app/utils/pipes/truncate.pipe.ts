import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(text: string, max: number): string {
    if (text.length <= max) {
      return text;
    }

    return text.substring(0, max) + '...';
  }
}
