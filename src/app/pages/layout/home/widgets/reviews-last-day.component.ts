import { Component, computed, inject, signal } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { MomentPipe } from '../../../../utils/pipes/moment.pipe';
import { BodyReviewComponent } from '../../../../ui/single-review/review-body.component';
import { HeaderReviewComponent } from '../../../../ui/single-review/review-header.component';
import { RouterModule } from '@angular/router';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'reviews-last-day',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    InlineSVGModule,
    TranslateModule,
    NumberPipe,
    MomentPipe,
    BodyReviewComponent,
    HeaderReviewComponent,
    RouterModule,
    MissingTranslationPipe,
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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div
        id="error-view"
        class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]"
      >
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div class="flex flex-col">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-6 lg:mt-0 max-w-3xl">
        <!-- <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-8">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'RECENT_REVIEWS' | translate }}
          </dt>
        </div> -->

        <div class="flex flex-row items-center justify-between w-full pb-4">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'RECENT_REVIEWS' | translate }}
          </dt>
          <div class="flex flex-row items-center gap-x-2 mr-1">
            <button
              type="button"
              class="flex flex-row items-center rounded-lg px-2.5 py-2 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
              [disabled]="start() === 0"
              (click)="showLess()"
            >
              <span
                [inlineSVG]="'arrow-left.svg'"
                class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
              ></span>
            </button>
            <button
              type="button"
              class="flex flex-row items-center rounded-lg px-2.5 py-2 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
              [disabled]="stopKeepGoing()"
              (click)="showMore()"
            >
              <span
                [inlineSVG]="'arrow-right.svg'"
                class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
              ></span>
            </button>
          </div>
        </div>

        <div class="flow-root">
          <div class="px-1">
            @for (review of store().data.slice(start(), end()); track $index) {
            <header-review [review]="review"></header-review>
            <body-review
              [review]="review"
              [showBorder]="$index !== store().data.slice(start(), end()).length - 1"
            ></body-review>
            }
          </div>
        </div>
        <!-- <div class="flex flex-col items-center justify-center w-full">
          <div class="flex flex-row items-center justify-end w-full pt-4 max-w-3xl">
            <div class="flex flex-row items-center gap-x-2">
              <button
                type="button"
                class="flex flex-row items-center rounded-lg px-2.5 py-2 mt-4 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
                [disabled]="start() === 0"
                (click)="showLess()"
              >
                <span
                  [inlineSVG]="'arrow-left.svg'"
                  class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
                ></span>
              </button>
              <button
                type="button"
                class="flex flex-row items-center rounded-lg px-2.5 py-2 mt-4 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
                [disabled]="stopKeepGoing()"
                (click)="showMore()"
              >
                <span
                  [inlineSVG]="'arrow-right.svg'"
                  class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
                ></span>
              </button>
            </div>
          </div>
        </div> -->
      </div>
      } @case ('error') {
      <ng-container [ngTemplateOutlet]="error"></ng-container>
      } @case ('empty') {
      <ng-container [ngTemplateOutlet]="empty"></ng-container>
      } @case ('loading') {
      <ng-container [ngTemplateOutlet]="loading"></ng-container>
      } }
    </div>
  `,
})
export class ReviewsLastDayComponent {
  store = inject(DashboardStore).recentReviews;
  translate = inject(TranslateService);

  reviesPerPage = 1;
  start = signal(0);
  end = signal(1);

  stopKeepGoing = computed(() => this.end() >= this.store().data.length);

  next() {
    this.start.set(this.start() + this.reviesPerPage);
    this.end.set(this.end() + this.reviesPerPage);
  }

  prev() {
    this.start.set(this.start() - this.reviesPerPage);
    this.end.set(this.end() - this.reviesPerPage);
  }

  showLess() {
    this.start.set(this.start() - this.reviesPerPage);
    this.end.set(this.end() - this.reviesPerPage);
  }

  showMore() {
    this.start.set(this.start() + this.reviesPerPage);
    this.end.set(this.end() + this.reviesPerPage);
  }
}
