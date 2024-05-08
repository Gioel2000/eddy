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
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="flex flex-col">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-6 lg:mt-0">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-8">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'RECENT_REVIEWS' | translate }}
          </dt>
        </div>

        <div class="flow-root">
          <div class="px-1">
            @for (review of store().data.slice(0, 4); track $index) { @defer (on viewport; prefetch on idle) {
            <header-review [review]="review"></header-review>
            } @placeholder {
            <div></div>
            } @loading {
            <div></div>
            } @defer (on viewport; prefetch on idle) {
            <body-review [review]="review" [showBorder]="$index !== store().data.slice(0, 4).length - 1"></body-review>
            } @placeholder {
            <div></div>
            } @loading {
            <div></div>
            } }
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
  `,
})
export class ReviewsLastDayComponent {
  store = inject(DashboardStore).recentReviews;
  translate = inject(TranslateService);
}
