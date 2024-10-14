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
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

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
    MissingTranslationPipe,
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
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div
      class="rounded-3xl ring-1 mx-px min-h-screen w-96 shadow-sm transition-all transform-gpu ease-in-out duration-300 "
      [ngClass]="{
        'ring-zinc-100 dark:ring-zinc-900': competitor().isExluded,
        'ring-zinc-200 dark:ring-[#1e1e1e]': !competitor().isExluded
      }"
    >
      @switch(state()) { @case('loaded') {
      <div class="relative flex h-44 w-full flex-col overflow-hidden rounded-t-3xl p-6">
        <span aria-hidden="true" class="absolute inset-0">
          <img
            [src]="competitor().image"
            alt=""
            class="h-full w-full object-cover object-center transition-all transform-gpu ease-in-out duration-300 "
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
        class="p-8 xl:p-10 transition-all transform-gpu ease-in-out duration-300 "
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
        } @else { @if ( competitor().rating.length !== 0 ) {
        <brand-reputation-graph
          [id]="competitor()._id"
          [reputation]="competitor().reputation"
          [state]="state()"
        ></brand-reputation-graph>
        <ratings-graph [id]="competitor()._id" [rating]="competitor().rating" [state]="state()"></ratings-graph>
        <channels-graph
          [id]="competitor()._id"
          [channelsRatings]="competitor().channelsRatings"
          [state]="state()"
        ></channels-graph>
        <categories-graph
          [id]="competitor()._id"
          [categories]="competitor().categories"
          [sentiment]="competitor().sentiment"
          [state]="state()"
        ></categories-graph>
        <types-graph [id]="competitor()._id" [typologies]="competitor().clientTypes" [state]="state()"></types-graph>
        <overview-reviews-last-day [recentReviews]="competitor().reviews" [state]="state()"></overview-reviews-last-day>
        <reviews-last-day [recentReviews]="competitor().reviews" [state]="state()"></reviews-last-day>

        <button
          class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] mt-6 w-full h-full transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/10 disabled:opacity-30"
          (click)="delete.emit(competitor()._id)"
        >
          <div
            class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
          >
            <span [inlineSVG]="'trash.svg'" class="svg-icon svg-icon-5 stroke-[1.7]"></span>
            <span class="font-semibold text-base">{{ 'DELETE' | translate }}</span>
          </div>
        </button>
        } @else {
        <div class="flex flex-col items-center justify-center w-full gap-4 py-10">
          <span class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <title>ufo</title>
              <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor">
                <circle cx="14.75" cy="1.75" r=".75" fill="currentColor" data-stroke="none" stroke="none"></circle>
                <path
                  d="M3.869,1.894l-.947-.315-.315-.947c-.103-.306-.609-.306-.712,0l-.315,.947-.947,.315c-.153,.051-.256,.194-.256,.356s.104,.305,.256,.356l.947,.315,.315,.947c.051,.153,.194,.256,.356,.256s.305-.104,.356-.256l.315-.947,.947-.315c.153-.051,.256-.194,.256-.356s-.104-.305-.256-.356Z"
                  fill="currentColor"
                  data-stroke="none"
                  stroke="none"
                ></path>
                <path
                  d="M5.223,5.526c-.012-.115-.015-.216-.015-.334,0-1.887,1.53-3.417,3.417-3.417,1.575,0,2.901,1.066,3.297,2.516"
                ></path>
                <path
                  d="M6.865,8.894c-2.701,.164-4.701-.232-4.844-1.07-.187-1.094,2.861-2.527,6.808-3.201,3.947-.674,7.298-.334,7.485,.76,.151,.886-1.822,1.995-4.676,2.743"
                ></path>
                <line x1="7.006" y1="7.689" x2="6" y2="16.25"></line>
                <line x1="11" y1="7" x2="16.25" y2="16.25"></line>
                <ellipse
                  cx="9.002"
                  cy="7.34"
                  rx="2.026"
                  ry=".316"
                  transform="translate(-1.13 1.66) rotate(-9.918)"
                  fill="currentColor"
                ></ellipse>
              </g>
            </svg>
          </span>
          <span class="text-base font-bold text-zinc-500 text-center">{{
            'CONFIGURE_CHANNELS_CONFIGURED' | translate
          }}</span>
        </div>
        <button
          class="w-full col-start-1 col-span-full sm:col-start-2 sm:col-span-1 cursor-pointer xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-md shadow-black/20 hover:shadow-lg hover:shadow-accent/40 hover:dark:shadow-accentDark/40 disabled:opacity-30"
          (click)="configure.emit(competitor())"
        >
          <div
            class="flex flex-row items-center justify-center gap-x-2 svg-icon-9 stroke-[2.6px] bg-accent dark:bg-accentDark h-full px-3.5 py-2.5 rounded-[7px] cursor-pointer"
          >
            <span class="font-semibold text-base">{{ 'CONFIGURE_CHANNELS' | translate }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
              <title>sliders vertical</title>
              <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                <line
                  x1="12.75"
                  y1="13.25"
                  x2="12.75"
                  y2="16.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                ></line>
                <line
                  x1="12.75"
                  y1="1.75"
                  x2="12.75"
                  y2="8.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                ></line>
                <circle
                  cx="12.75"
                  cy="11"
                  r="2.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                ></circle>
                <line x1="5.25" y1="4.75" x2="5.25" y2="1.75" stroke-linecap="round" stroke-linejoin="round"></line>
                <line x1="5.25" y1="16.25" x2="5.25" y2="9.25" stroke-linecap="round" stroke-linejoin="round"></line>
                <circle cx="5.25" cy="7" r="2.25" stroke-linecap="round" stroke-linejoin="round"></circle>
              </g>
            </svg>
          </div>
        </button>
        } }
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
  @Output() configure = new EventEmitter<CompetitorModel>();
}
