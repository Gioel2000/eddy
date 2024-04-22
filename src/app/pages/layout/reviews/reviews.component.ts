import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { SentimentComponent } from './ui/sentiment-words.component';
import { CategoriesDropdownComponent } from './categories/categories.component';

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
    SentimentComponent,
    CategoriesDropdownComponent,
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
      <div class="mx-auto bg-white dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-10 pb-6">
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
            >
              <div
                class="grid gap-4 grid-cols-full sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 w-full xl:w-auto max-w-full gap-y-6"
              >
                <date-picker
                  class="col-span-1"
                  [i18n]="'STARTDATE'"
                  [date]="startdate()"
                  [limitStart]="limitStart"
                  [limitEnd]="enddate() || now"
                  [rapidDates]="[]"
                  (onDateSet)="setStartDate($event)"
                ></date-picker>
                <date-picker
                  class="col-span-1"
                  [i18n]="'ENDDATE'"
                  [date]="enddate()"
                  [limitStart]="startdate() || limitStart"
                  [limitEnd]="now"
                  [rapidDates]="[]"
                  (onDateSet)="setEndDate($event)"
                ></date-picker>
                <channels-dropdown class="col-span-1"></channels-dropdown>
                <types-dropdown class="col-span-1"></types-dropdown>
                <categories-dropdown class="col-span-1"></categories-dropdown>
                <a
                  class="flex flex-row items-center justify-center rounded-xl col-span-full xl:col-span-1 px-3 py-2 w-full h-auto cursor-pointer ring-1 ring-zinc-800 bg-zinc-800 hover:bg-zinc-900 text-white shadow-[shadow:inset_0_0.8px_theme(colors.white/50%)] hover:shadow-[shadow:inset_0_0.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/20%)] hover:dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/10%)] transition ease-in-out duration-200"
                  (click)="reviews.reset()"
                >
                  {{ 'RESET' | translate }}
                </a>
              </div>
            </ul>
          </nav>
          @if (reviews.store.isDownloading()) {
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
              'blur-md opacity-80': reviews.store.isDownloading()
            }"
          >
            @switch (store.state()) { @case ('loaded') {
            <div>
              <div
                class="max-w-3xl px-4 sm:px-6 sm:py-4 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8"
              >
                <div class="lg:col-span-5">
                  <div class="flex flex-col sticky top-0 w-full">
                    <ratings-graph></ratings-graph>
                    <sentiment-graph></sentiment-graph>
                  </div>
                </div>

                <div class="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                  <h3 class="sr-only">Recent reviews</h3>

                  <div class="flow-root">
                    <div class="pt-8">
                      @for (review of store.reviews(); track $index) { @defer (on viewport; prefetch on idle) {
                      <header-review [review]="review"></header-review>
                      } @placeholder {
                      <div></div>
                      } @loading {
                      <div></div>
                      } @defer (on viewport; prefetch on idle) {
                      <body-review [review]="review" [showBorder]="$index !== store.reviews().length - 1"></body-review>
                      } @placeholder {
                      <div></div>
                      } @loading {
                      <div></div>
                      } }
                    </div>

                    @if (store.state() === 'loaded' && store.reviews().length > 0) {
                    <div class="flex flex-col items-center justify-center w-full">
                      <div
                        class="flex flex-row items-center justify-between w-full p-4 max-w-3xl ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 shadow-sm rounded-xl"
                      >
                        <div>
                          <span class="font-medium text-base mx-2 text-zinc-800 dark:text-zinc-200"
                            >{{ 'PAGE' | translate }}: {{ reviews.page() }}</span
                          >
                        </div>
                        <div class="flex flex-row items-center gap-x-2">
                          <button
                            class="flex flex-row items-center justify-center rounded-lg px-3 py-2 w-full h-auto cursor-pointer ring-1 ring-accent dark:ring-accentDark bg-accent dark:bg-accentDark hover:opacity-80 text-white shadow-[shadow:inset_0_0.8px_theme(colors.white/50%)] hover:shadow-[shadow:inset_0_0.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/20%)] hover:dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/10%)] transition ease-in-out duration-200 disabled:opacity-30"
                            [disabled]="reviews.filter().offset === 0"
                            (click)="showLess()"
                          >
                            <span [inlineSVG]="'arrow-left.svg'" class="svg-icon svg-icon-3 stroke-[1.8]"></span>
                          </button>
                          <button
                            class="flex flex-row items-center justify-center rounded-lg px-3 py-2 w-full h-auto cursor-pointer ring-1 ring-accent dark:ring-accentDark bg-accent dark:bg-accentDark hover:opacity-80 text-white shadow-[shadow:inset_0_0.8px_theme(colors.white/50%)] hover:shadow-[shadow:inset_0_0.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/20%)] hover:dark:shadow-[shadow:inset_0_0.8px_theme(colors.white/10%)] transition ease-in-out duration-200 disabled:opacity-30"
                            [disabled]="stopKeepGoing()"
                            (click)="showMore()"
                          >
                            <span [inlineSVG]="'arrow-right.svg'" class="svg-icon svg-icon-3 stroke-[1.8]"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    }
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

  setStartDate(startdate: any) {
    this.reviews.filter.set({ ...this.reviews.filter(), startdate, offset: 0 });
  }

  setEndDate(enddate: Date) {
    this.reviews.filter.set({ ...this.reviews.filter(), enddate, offset: 0 });
  }

  showLess() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.reviews.page.set(this.reviews.page() - 1);
    this.reviews.filter.set({ ...this.reviews.filter(), offset: this.reviews.filter().offset - 5 });
  }

  showMore() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.reviews.page.set(this.reviews.page() + 1);
    this.reviews.filter.set({ ...this.reviews.filter(), offset: this.reviews.filter().offset + 5 });
  }
}
