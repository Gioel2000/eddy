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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="rounded-3xl ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 min-h-screen w-96 shadow-sm">
      @switch(state()) { @case('loaded') {
      <div class="relative flex h-44 w-full flex-col overflow-hidden rounded-t-3xl p-6">
        <span aria-hidden="true" class="absolute inset-0">
          <img [src]="competitor().image" alt="" class="h-full w-full object-cover object-center" />
        </span>
        <span
          aria-hidden="true"
          class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white dark:from-dark"
        ></span>
      </div>

      <div class="p-8 xl:p-10">
        <p class="text-sm leading-6 text-zinc-700 dark:text-zinc-300 line-clamp-1">
          {{ competitor().address }}, {{ competitor().city }}
        </p>
        <p class="flex items-baseline gap-x-1 h-[6rem]">
          <span class="text-4xl font-bold tracking-tight text-black dark:text-white py-2 line-clamp-2">{{
            competitor().name
          }}</span>
        </p>
        @if (competitor().isDownloading) {
        <div class="flex flex-col items-center text-balance text-center gap-y-3 my-24 animate-pulse">
          <span class="svg-icon-1 stroke-2 text-zinc-900 dark:text-zinc-100" [inlineSVG]="'star-sparkle.svg'"></span>
          <p class="text-2xl font-bold leading-8 text-zinc-900 dark:text-zinc-100 tracking-tight">
            {{ 'WARNING' | translate }}
          </p>
          <p
            class="text-center text-base font-medium max-w-[24rem] text-zinc-900 dark:text-zinc-100 opacity-75 mt-1 tracking-tight"
          >
            {{ 'DOWNLOADING_REVIEWS' | translate }}
          </p>
        </div>
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
        <ratings-graph [rating]="competitor().rating" [state]="state()"></ratings-graph>
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
        <channels-graph [channelsRatings]="competitor().channelsRatings" [state]="state()"></channels-graph>
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
          class="flex flex-row items-center justify-center w-full rounded-lg mt-8 gap-x-1 py-2.5 px-4 cursor-pointer ring-1 ring-inset ring-red-600 bg-red-500 hover:bg-red-600/90 text-white shadow-[shadow:inset_0_2.3px_theme(colors.white/40%)] disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
          (click)="delete.emit(competitor()._id)"
        >
          <span [inlineSVG]="'trash.svg'" class="svg-icon-5 stroke-[1.7]"></span>
          <span class="font-semibold text-base">{{ 'DELETE' | translate }}</span>
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
}
