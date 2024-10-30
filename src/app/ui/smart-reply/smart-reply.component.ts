import { Component, inject } from '@angular/core';
import { SmartReplyDialogService } from './smart-reply.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderReviewComponent } from '../single-review/review-header.component';
import moment from 'moment';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';

@Component({
  selector: 'smart-reply-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeaderReviewComponent, InlineSVGModule, ClickOutsideDirective],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
        hidden: !smartReplyDialog.isDialogOpen(),
      }"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-3xl sm:p-6"
            [ngClass]="{
              'opacity-100 translate-y-0 sm:scale-100': smartReplyDialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !smartReplyDialog.isDialogVisible()
            }"
            (clickOutside)="smartReplyDialog.isDialogVisible() && smartReplyDialog.closeDialog()"
          >
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100 animate-blurToClear100"
                (click)="smartReplyDialog.closeDialog()"
              >
                <span class="svg-icon svg-icon-8 stroke-[1.6]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="14"
                        y1="4"
                        x2="4"
                        y2="14"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-color="color-2"
                      ></line>
                      <line
                        x1="4"
                        y1="4"
                        x2="14"
                        y2="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                    </g>
                  </svg>
                </span>
              </button>
            </div>
            <div class="sm:flex sm:items-start">
              <div class="flex space-x-4 text-sm text-zinc-500">
                <div class="flex-none py-3">
                  <div
                    class="h-10 w-10 rounded-full"
                    class="bg-accent dark:bg-accentDark flex flex-row items-center justify-center cursor-pointer rounded-full w-12 h-12 font-bold text-base text-white"
                  >
                    {{ nameFormatter(smartReplyDialog.review()?.name).charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div class="flex-1 py-3">
                  <div class="flex flex-row items-center">
                    <h3 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-7">
                      {{ nameFormatter(smartReplyDialog.review()?.name) }}
                    </h3>
                    <span
                      *ngIf="smartReplyDialog.review()?.name === 'Verified traveler'"
                      [inlineSVG]="'badge-check.svg'"
                      class="svg-icon svg-icon svg-icon-4 stroke-[1.3] ml-1 text-zinc-800 dark:text-zinc-200"
                    ></span>
                  </div>
                  <p class="font-normal tracking-tight text-zinc-400 dark:text-zinc-600">
                    {{ formatDate(smartReplyDialog.review()?.date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SmartReplyDialogComponent {
  smartReplyDialog = inject(SmartReplyDialogService);
  translateService = inject(TranslateService);

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

  formatDate(date: Date | string | null | undefined): string {
    const currentLang = this.translateService.currentLang;
    const todayLabel = this.translateService.instant('TODAY');

    return moment(date)
      .locale(currentLang)
      .format('DD MMMM YYYY')
      .replace(moment(new Date()).locale(currentLang).format('DD MMMM YYYY'), `${todayLabel} `);
  }
}
