import { Component, Input, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import moment from 'moment';
import { ReviewTO } from '../../store/dashboard/interfaces/dashboard';

@Component({
  selector: 'header-review',
  standalone: true,
  imports: [CommonModule, InlineSVGModule],
  template: `
    <div class="flex space-x-4 text-sm text-zinc-500">
      <div class="flex-none py-5">
        <div
          class="h-10 w-10 rounded-full"
          class="bg-blue-500 flex flex-row items-center justify-center cursor-pointer rounded-full w-12 h-12 text-base text-white/80"
        >
          {{ review().name.charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="flex-1 py-5">
        <div class="flex flex-row items-center mt-1">
          <h3 class="font-medium text-zinc-900 dark:text-zinc-100">
            {{ nameFormatter(review().name) }}
          </h3>
          <span
            *ngIf="review().name === 'Verified traveler'"
            [inlineSVG]="'./assets/icons/bold/Check badge.svg'"
            class="svg-icon svg-icon-4 text-zinc-800 dark:text-zinc-200"
          ></span>
        </div>

        <p>
          <time class="capitalize">{{ formatDate(review().date) }}</time>
        </p>
      </div>
    </div>
  `,
})
export class HeaderReviewComponent {
  review = input.required<ReviewTO>();

  constructor(private translateService: TranslateService) {}

  nameFormatter(name: string): string {
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
      .format('ddd DD MMM YYYY')
      .replace(moment(new Date()).locale(currentLang).format('ddd DD MMM YYYY'), `${todayLabel} `);
  }
}
