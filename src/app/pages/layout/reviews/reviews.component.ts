import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DatePickerComponent } from '../../../ui/datepicker/datepicker.component';
import { ReviewsService } from './reviews.service';
import moment from 'moment';
import { ChannelsDropdownComponent } from './channels/channels.component';
import { TypesDropdownComponent } from './types/types.component';
import { ReviewsStore } from '../../../store/reviews/reviews.service';
import { LoaderComponent } from '../../../ui/loader/loader.component';
import { RatingsComponent } from './ui/ratings.component';
import { HeaderReviewComponent } from '../../../ui/single-review/review-header.component';
import { BodyReviewComponent } from '../../../ui/single-review/review-body.component';

@Component({
  selector: 'reviews',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    DatePickerComponent,
    ChannelsDropdownComponent,
    TypesDropdownComponent,
    LoaderComponent,
    RatingsComponent,
    HeaderReviewComponent,
    BodyReviewComponent,
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="h-full lg:pr-10 lg:pl-3 px-4">
      <h1 class="hidden sm:block text-xl font-medium text-zinc-900 dark:text-zinc-100">{{ 'REVIEWS' | translate }}</h1>
      <div class="mx-auto bg-zinc-50 dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-10 pb-6">
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
            >
              <div class="grid gap-4 sm:grid-cols-5 w-full sm:w-auto sm:max-w-full gap-y-6">
                <date-picker
                  class="col-span-1"
                  [i18n]="'STARTDATE'"
                  [date]="startdate()"
                  [limitStart]="limitStart"
                  [limitEnd]="enddate() || now"
                  (onDateSet)="setStartDate($event)"
                ></date-picker>
                <date-picker
                  class="col-span-1"
                  [i18n]="'ENDDATE'"
                  [date]="enddate()"
                  [limitStart]="startdate() || limitStart"
                  [limitEnd]="now"
                  (onDateSet)="setEndDate($event)"
                ></date-picker>
                <channels-dropdown class="col-span-1"></channels-dropdown>
                <types-dropdown class="col-span-1"></types-dropdown>
                <button
                  type="button"
                  class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-xl px-3 py-2 cursor-pointer ring-1 ring-inset ring-zinc-950 hover:ring-zinc-800 bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
                  (click)="reviews.reset()"
                >
                  {{ 'RESET' | translate }}
                </button>
              </div>
            </ul>
          </nav>
          @switch (store.state()) { @case ('loaded') {
          <div>
            <div class="max-w-3xl px-4 sm:px-6 sm:py-4 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
              <div class="lg:col-span-4"><ratings-graph></ratings-graph></div>

              <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <h3 class="sr-only">Recent reviews</h3>

                <div class="flow-root">
                  <div class="pt-8">
                    @for (review of store.reviews(); track $index) {
                    <header-review [review]="review"></header-review>
                    <body-review [review]="review"></body-review>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          } @case ('error') {
          <ng-container [ngTemplateOutlet]="error"></ng-container>
          } @case ('empty') {
          <ng-container [ngTemplateOutlet]="empty"></ng-container>
          } @case ('loading') {
          <ng-container [ngTemplateOutlet]="loading"></ng-container>
          } }
        </div>
        <div class="flex flex-row items-center justify-between w-full px-3 py-5">
          <div>
            <span class="font-medium text-base mx-2 text-zinc-800 dark:text-zinc-200"
              >{{ 'PAGE' | translate }}: {{ page() }}</span
            >
          </div>
          <div class="flex flex-row items-center gap-x-2">
            <button
              class="flex flex-row items-center bg-accent rounded-xl px-2.5 py-2 shadow-sm text-zinc-100 dark:text-zinc-100 hover:bg-accent/70 text-sm font-medium leading-6 disabled:bg-accent/30"
              (click)="showLess()"
              [disabled]="reviews.filter().offset === 0"
            >
              <span [inlineSVG]="'arrow-left.svg'" class="svg-icon svg-icon-3 stroke-[1.8]"></span>
            </button>
            <button
              class="flex flex-row items-center bg-accent rounded-xl px-2.5 py-2 shadow-sm text-zinc-100 dark:text-zinc-100 hover:bg-accent/70 text-sm font-medium disabled:bg-accent/30 leading-6"
              (click)="showMore()"
              [disabled]="stopKeepGoing()"
            >
              <span [inlineSVG]="'arrow-right.svg'" class="svg-icon svg-icon-3 stroke-[1.8]"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReviewsComponent {
  reviews = inject(ReviewsService);
  store = inject(ReviewsStore);

  limitStart = moment().subtract(1, 'year').toDate();
  now = moment().toDate();
  startdate = computed(() => this.reviews.filter().startdate);
  enddate = computed(() => this.reviews.filter().enddate);
  offset = signal(0);
  stopKeepGoing = computed(() => this.store.reviews().length < 5);
  page = signal(1);

  setStartDate(startdate: any) {
    this.reviews.filter.set({ ...this.reviews.filter(), startdate, offset: 0 });
  }

  setEndDate(enddate: Date) {
    this.reviews.filter.set({ ...this.reviews.filter(), enddate, offset: 0 });
  }

  showLess() {
    this.page.set(this.page() - 1);
    this.reviews.filter.set({ ...this.reviews.filter(), offset: this.reviews.filter().offset - 5 });
  }

  showMore() {
    this.page.set(this.page() + 1);
    this.reviews.filter.set({ ...this.reviews.filter(), offset: this.reviews.filter().offset + 5 });
  }
}
