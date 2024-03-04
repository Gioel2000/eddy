import { Pipe, PipeTransform } from '@angular/core';
import { MISSING_TRANSLATION } from '../constants/missingTranslation';

@Pipe({
  name: 'missingTranslation',
  standalone: true,
})
export class MissingTranslationPipe implements PipeTransform {
  transform(value: string, text: string): string {
    if (value === MISSING_TRANSLATION) return text;
    return value;
  }
}
