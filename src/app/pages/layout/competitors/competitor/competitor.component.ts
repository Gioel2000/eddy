import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompetitorModel, StateModel } from '../../../../store/competitors/interfaces/competitors';
import { BrandReputationComponent } from './widgets/brand-reputation.component';
import { RatingsComponent } from './widgets/ratings.component';
import { TypesComponent } from './widgets/types.component';
import { ReviewsLastDayComponent } from './widgets/reviews-last-day.component';
import { OverviewReviewsLastDayComponent } from './widgets/overview-reviews-last-day.component';
import { ChannelsComponent } from './widgets/channels.component';
import { CategoriesComponent } from './widgets/categories.component';
import { SparkleComponent } from '../../../../ui/sparkle/sparkle.component';

@Component({
  selector: 'competitor',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    LoaderComponent,
    TranslateModule,
    BrandReputationComponent,
    RatingsComponent,
    TypesComponent,
    ReviewsLastDayComponent,
    OverviewReviewsLastDayComponent,
    ChannelsComponent,
    CategoriesComponent,
    SparkleComponent,
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div
      class="rounded-3xl ring-1 mx-px min-h-screen w-96 shadow-sm transition-all transform-gpu ease-in-out duration-300"
      [ngClass]="{
        'ring-zinc-100 dark:ring-zinc-900': competitor().isExluded,
        'ring-zinc-200 dark:ring-zinc-800': !competitor().isExluded
      }"
    >
      @switch(state()) { @case('loaded') {

      <div class="relative flex h-44 w-full flex-col overflow-hidden rounded-t-3xl p-6">
        <span aria-hidden="true" class="absolute inset-0">
          <img
            [src]="competitor().image"
            alt=""
            class="h-full w-full object-cover object-center transition-all transform-gpu ease-in-out duration-300"
            [ngClass]="{
              'opacity-50': competitor().isExluded,
            }"
          />
        </span>
        <span
          aria-hidden="true"
          class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white dark:from-dark"
        ></span>

        @if (competitor().isExluded) {
        <button
          class="absolute top-3 right-3 flex flex-col items-center justify-center rounded-full bg-white dark:bg-dark hover:bg-zinc-50 dark:hover:bg-zinc-950 ring-1 ring-zinc-50 dark:ring-zinc-950 h-8 w-8 shadow-md shadow-black/20"
          (click)="include.emit(competitor()._id)"
        >
          <span class="svg-icon svg-icon-8 stroke-2 text-zinc-700 dark:text-zinc-300" [inlineSVG]="'plus.svg'"></span>
        </button>
        } @else {
        <button
          class="absolute top-3 right-3 flex flex-col items-center justify-center rounded-full bg-white dark:bg-dark hover:bg-zinc-50 dark:hover:bg-zinc-950 ring-1 ring-zinc-50 dark:ring-zinc-950 h-8 w-8 shadow-md shadow-black/20"
          (click)="exlude.emit(competitor()._id)"
        >
          <span class="svg-icon svg-icon-8 stroke-2 text-zinc-700 dark:text-zinc-300" [inlineSVG]="'minus.svg'"></span>
        </button>
        }
      </div>

      <div
        class="p-8 xl:p-10 transition-all transform-gpu ease-in-out duration-300"
        [ngClass]="{
          'opacity-50': competitor().isExluded,
        }"
      >
        <p class="text-sm leading-6 text-zinc-700 dark:text-zinc-300 line-clamp-1">
          {{ competitor().address }}, {{ competitor().city }}
        </p>
        <p class="flex items-baseline gap-x-1 h-[6rem]">
          <span class="text-4xl font-bold tracking-tight text-black dark:text-white pt-2 line-clamp-2 leading-tight">{{
            competitor().name
          }}</span>
        </p>
        @if (competitor().isDownloading) {
        <sparkle [title]="'WARNING' | translate" [description]="'DOWNLOADING_REVIEWS' | translate"></sparkle>
        } @else { @defer (on viewport; prefetch on idle) {
        <brand-reputation-graph
          [id]="competitor()._id"
          [reputation]="competitor().reputation"
          [state]="state()"
        ></brand-reputation-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <ratings-graph [id]="competitor()._id" [rating]="competitor().rating" [state]="state()"></ratings-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <categories-graph
          [id]="competitor()._id"
          [categories]="competitor().categories"
          [sentiment]="competitor().sentiment"
          [state]="state()"
        ></categories-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <channels-graph
          [id]="competitor()._id"
          [channelsRatings]="competitor().channelsRatings"
          [state]="state()"
        ></channels-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <types-graph [typologies]="competitor().clientTypes" [state]="state()"></types-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <overview-reviews-last-day [recentReviews]="competitor().reviews" [state]="state()"></overview-reviews-last-day>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <reviews-last-day [recentReviews]="competitor().reviews" [state]="state()"></reviews-last-day>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        }

        <button
          class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] mt-6 w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/10 disabled:opacity-30"
          (click)="delete.emit(competitor()._id)"
        >
          <div
            class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
          >
            <span [inlineSVG]="'trash.svg'" class="svg-icon svg-icon-5 stroke-[1.7]"></span>
            <span class="font-semibold text-base">{{ 'DELETE' | translate }}</span>
          </div>
        </button>
        }
      </div>
      } @case('loading') {
      <ng-container *ngTemplateOutlet="loading"></ng-container>
      } @case('error') {
      <ng-container *ngTemplateOutlet="error"></ng-container>
      } @default {
      <ng-container *ngTemplateOutlet="empty"></ng-container>
      } }
    </div>
  `,
})
export class CompetitorComponent {
  competitor = input.required<CompetitorModel>();
  state = input.required<StateModel>();

  @Output() delete = new EventEmitter<string>();
  @Output() exlude = new EventEmitter<string>();
  @Output() include = new EventEmitter<string>();
}
