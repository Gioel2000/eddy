import { Component, computed, effect, inject } from '@angular/core';
import { StructureStore } from '../../../../store/structures/structure.service';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrandReputationComponent } from './widgets/brand-reputation.component';
import { RatingsComponent } from './widgets/ratings.component';
import { ReviewsLastDayComponent } from './widgets/reviews-last-day.component';
import { TypesComponent } from './widgets/types.component';
import { OverviewReviewsLastDayComponent } from './widgets/overview-reviews-last-day.component';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { ChannelsComponent } from './widgets/channels.component';
import { CategoriesComponent } from './widgets/categories.component';

@Component({
  selector: 'you',
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

    <div class="rounded-3xl ring-1 ring-inset bg-[#171715] ring-zinc-800 min-h-screen shadow-sm w-96">
      @switch(state()) { @case('loaded') {
      <div class="relative flex h-44 w-full flex-col overflow-hidden rounded-t-3xl p-6">
        <span aria-hidden="true" class="absolute inset-0">
          <img [src]="selected().image" alt="" class="h-full w-full object-cover object-center" />
        </span>
        <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#171715]"></span>
      </div>
      <div class="p-8 xl:p-10">
        <p class="text-sm leading-6 text-zinc-300 line-clamp-1">{{ selected().address }}, {{ selected().city }}</p>
        <p class="flex items-baseline gap-x-1 h-[6rem]">
          <span class="text-4xl font-bold tracking-tight text-white line-clamp-2">{{ selected().name }}</span>
        </p>
        @if (dashboard.isDownloading()) {
        <div class="flex flex-col items-center text-balance text-center gap-y-3 my-24 animate-pulse">
          <span class="svg-icon-1 stroke-2 text-zinc-100" [inlineSVG]="'star-sparkle.svg'"></span>
          <p class="text-2xl font-bold leading-8 text-zinc-100 tracking-tight">
            {{ 'WARNING' | translate }}
          </p>
          <p class="text-center text-base font-medium max-w-[24rem] text-zinc-100 opacity-75 mt-1 tracking-tight">
            {{ 'DOWNLOADING_REVIEWS' | translate }}
          </p>
        </div>
        } @else { @defer (on viewport; prefetch on idle) {
        <brand-reputation-graph></brand-reputation-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <ratings-graph></ratings-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <categories-graph></categories-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <channels-graph></channels-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <types-graph></types-graph>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <overview-reviews-last-day></overview-reviews-last-day>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
        } @defer (on viewport; prefetch on idle) {
        <reviews-last-day></reviews-last-day>
        } @placeholder {
        <div></div>
        } @loading {
        <div></div>
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
export class YouComponent {
  store = inject(StructureStore);
  dashboard = inject(DashboardStore);

  selected = computed(() => this.store.selected());
  state = computed(() => this.store.selectedState());
}
