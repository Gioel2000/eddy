import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DatePickerComponent } from '../../../ui/datepicker/datepicker.component';
import { HomeService } from './home.service';
import { ChannelsDropdownComponent } from './channels/channels.component';
import moment from 'moment';
import { BrandReputationComponent } from './widgets/brand-reputation.component';
import { RatingsComponent } from './widgets/ratings.component';
import { TypesComponent } from './widgets/types.component';
import { ReviewsLastDayComponent } from './widgets/reviews-last-day.component';
import { OverviewReviewsLastDayComponent } from './widgets/overview-reviews-last-day.component';
import { ChannelsComponent } from './widgets/channels.component';
import { CategoriesComponent } from './widgets/categories.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ReactiveFormsModule,
    DatePickerComponent,
    ChannelsDropdownComponent,
    BrandReputationComponent,
    RatingsComponent,
    TypesComponent,
    ChannelsComponent,
    ReviewsLastDayComponent,
    CategoriesComponent,
    OverviewReviewsLastDayComponent,
  ],
  template: `
    <div class="h-full lg:pr-10 lg:pl-3 px-4">
      <h1 class="hidden sm:block text-xl font-medium text-zinc-900 dark:text-zinc-100">Home</h1>
      <div class="mx-auto bg-light dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-10 pb-6">
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
            >
              <div class="grid gap-4 sm:grid-cols-3 w-full sm:w-auto sm:max-w-full gap-y-6">
                <date-picker
                  class="col-span-1"
                  [i18n]="'STARTDATE'"
                  [date]="startdate()"
                  [limitStart]="limitStart"
                  [limitEnd]="enddate()"
                  [rapidDates]="pastRapidDates"
                  (onDateSet)="setStartDate($event)"
                ></date-picker>
                <date-picker
                  class="col-span-1"
                  [i18n]="'ENDDATE'"
                  [date]="enddate()"
                  [limitStart]="startdate()"
                  [limitEnd]="now"
                  [rapidDates]="[]"
                  (onDateSet)="setEndDate($event)"
                ></date-picker>
                <channels-dropdown class="col-span-1"></channels-dropdown>
              </div>
            </ul>
          </nav>

          @if (home.store.isDownloading()) {
          <div class="absolute inset-0 flex justify-center items-center z-10 lg:pl-72 py-8 animate-pulse">
            <div class="flex flex-col items-center text-balance text-center gap-y-3">
              <span
                class="svg-icon-1 stroke-2 text-zinc-900 dark:text-zinc-100"
                [inlineSVG]="'star-sparkle.svg'"
              ></span>
              <p class="text-2xl font-bold leading-8 text-zinc-900 dark:text-zinc-100 tracking-tight">
                {{ 'WARNING' | translate }}
              </p>
              <p
                class="text-center text-base font-medium max-w-[24rem] text-zinc-900 dark:text-zinc-100 opacity-75 mt-1 tracking-tight"
              >
                {{ 'DOWNLOADING_REVIEWS' | translate }}
              </p>
            </div>
          </div>
          }
          <div
            [ngClass]="{
              'blur-md opacity-80': home.store.isDownloading()
            }"
          >
            <brand-reputation-graph></brand-reputation-graph>
            <div
              class="divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
            >
              <div class="bg-light dark:bg-dark sm:pr-10 py-6">
                <ratings-graph></ratings-graph>
              </div>
              <div class="bg-light dark:bg-dark sm:pl-10 py-6">
                <categories-graph></categories-graph>
              </div>

              <div class="bg-light dark:bg-dark sm:pr-10 py-6"><channels-graph></channels-graph></div>
              <div class="bg-light dark:bg-dark sm:pl-10 py-6"><types-graph></types-graph></div>

              <div class="bg-light dark:bg-dark sm:pr-10 py-6">
                <reviews-last-day></reviews-last-day>
              </div>
              <div class="bg-light dark:bg-dark sm:pl-10 py-6">
                <overview-reviews-last-day></overview-reviews-last-day>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  home = inject(HomeService);

  limitStart = moment().subtract(1, 'year').toDate();
  now = moment().toDate();

  startdate = computed(() => this.home.store.filter().startdate);
  enddate = computed(() => this.home.store.filter().enddate);

  setStartDate(date: Date) {
    this.home.store.filter.set({ ...this.home.store.filter(), startdate: date });
  }

  setEndDate(date: Date) {
    this.home.store.filter.set({ ...this.home.store.filter(), enddate: date });
  }

  pastRapidDates = [
    {
      key: '2_WEEKS_AGO',
      value: moment().toDate(),
    },
    {
      key: 'LAST_MONTH',
      value: moment().subtract(1, 'month').toDate(),
    },
    {
      key: '3_MONTHS_AGO',
      value: moment().subtract(3, 'months').toDate(),
    },
  ];
}
