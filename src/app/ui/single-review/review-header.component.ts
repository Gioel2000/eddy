import { Component, Input, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import moment from 'moment';
import { ReviewTO } from '../../store/reviews/interfaces/reviews';

@Component({
  selector: 'header-review',
  standalone: true,
  imports: [CommonModule, InlineSVGModule],
  template: `
    <div class="flex space-x-4 text-sm text-zinc-500">
      <div class="flex-none py-3">
        <div
          class="h-10 w-10 rounded-full"
          class="bg-accent dark:bg-accentDark flex flex-row items-center justify-center cursor-pointer rounded-full w-12 h-12 font-bold text-base text-white"
        >
          {{ nameFormatter(review().name).charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="flex-1 py-3">
        <div class="flex flex-row items-center">
          <h3 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-7">
            {{ nameFormatter(review().name) }}
          </h3>
          <span
            *ngIf="review().name === 'Verified traveler'"
            [inlineSVG]="'badge-check.svg'"
            class="svg-icon svg-icon svg-icon-4 stroke-[1.3] ml-1 text-zinc-800 dark:text-zinc-200"
          ></span>
        </div>
        <p class="font-medium tracking-tight text-zinc-400 dark:text-zinc-600">{{ formatDate(review().date) }}</p>
      </div>
    </div>
  `,
})
export class HeaderReviewComponent {
  review = input.required<ReviewTO>();

  constructor(private translateService: TranslateService) {}

  nameFormatter(name: string | undefined): string {
    if (!name) {
      const unknownUser = this.translateService.instant('UNKNOWN_USER');
      return unknownUser;
    }

    if (name.toLowerCase() === 'verified traveler') {
      return this.translateService.instant('VERIFIED_TRAVELER');
    }

    return name;
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  formatDate(date: Date | string): string {
    const currentLang = this.translateService.currentLang;
    const todayLabel = this.translateService.instant('TODAY');

    return moment(date)
      .locale(currentLang)
      .format('DD MMMM YYYY')
      .replace(moment(new Date()).locale(currentLang).format('DD MMMM YYYY'), `${todayLabel} `);
  }
}
