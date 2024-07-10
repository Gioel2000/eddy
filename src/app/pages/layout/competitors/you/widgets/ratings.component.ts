import { Component, computed, inject } from '@angular/core';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { CompetitorsService } from '../../competitors.service';
import { MissingTranslationPipe } from '../../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'ratings-graph',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, NumberPipe, MissingTranslationPipe],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[525px]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[525px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[525px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div #container class="flex flex-col border-b border-zinc-800 py-6">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-200">
            {{ 'REVIEWS' | translate }}
          </dt>
          <div class="flex flex-row items-center gap-x-3 w-full">
            <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-100">
              {{ totalReviews() | numb : translate.currentLang : 2 }}
            </dd>
            <dd
              class="flex flex-row items-center text-sm font-semibold tracking-tight leading-9 px-2 rounded-md gap-x-1"
              [ngClass]="{
                'text-green-600 bg-green-900': isGrowthPercentagePositive(),
                'text-zinc-500 bg-zinc-900': !isGrowthPercentagePositive(),
              }"
            >
              <span
                [inlineSVG]="isGrowthPercentagePositive() ? 'arrow-up.svg' : 'priority-normal.svg'"
                class="svg-icon svg-icon-7 stroke-2"
              ></span>
              <span> {{ growthPercentage() | numb : translate.currentLang : 2 }}% </span>
            </dd>
          </div>
          <dt class="text-sm font-medium leading-6 text-zinc-500">
            vs. {{ totalReviewsReceived() | numb : translate.currentLang : 2 }}
            {{ 'SUM_OF_PERIOD' | translate | lowercase }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            @for (vote of [5,4,3,2,1]; track $index) { @if (getStarData(vote); as rating) {
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">{{ vote }}<span class="sr-only"> star reviews</span></p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    class="drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div class="h-3 rounded-full border border-zinc-700 bg-zinc-800"></div>
                    <div
                      [style.width.%]="rating.percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    <div
                      [style.width.%]="rating.percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    <div
                      [style.left.%]="rating.competitorPercentage"
                      class="absolute inset-y-0 border border-violet-400 bg-violet-400 w-1"
                    ></div>
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-200">
                  {{ rating.count | numb : translate.currentLang : 0 }}
                </dd>
                <dd
                  class="w-8 text-left font-semibold text-sm tabular-nums ml-1.5"
                  [ngClass]="{
                    'text-green-500': rating.received > 0,
                    'text-zinc-600': rating.received === 0
                  }"
                >
                  +{{ rating.received | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-8 text-sm text-right font-medium tabular-nums text-zinc-500">
                  {{ rating.percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd class="w-10 text-right font-semibold text-sm tabular-nums text-violet-500">
                  {{ rating.competitorPercentage | numb : translate.currentLang : 0 }}%
                </dd>
              </div>
            </div>
            } }
          </dl>
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
export class RatingsComponent {
  store = inject(DashboardStore).ratings;
  translate = inject(TranslateService);
  competitors = inject(CompetitorsService);

  totalReviews = computed(() => this.store().data.reduce((acc, curr) => acc + curr.totalCount, 0));
  totalReviewsReceived = computed(() => this.store().data.reduce((acc, curr) => acc + curr.filteredCount, 0));

  growthPercentage = computed(() => {
    const now = this.totalReviews();
    const received = this.totalReviewsReceived();
    return (received / now) * 100;
  });

  isGrowthPercentagePositive = computed(() => this.growthPercentage() > 0);

  getStarData(rating: number) {
    const row = this.store().data.find((item) => item.rating === rating);
    const count = row?.totalCount || 0;
    const received = row?.filteredCount || 0;
    const percentage = (count / this.totalReviews()) * 100;
    const growth = (received / this.totalReviews()) * 100;
    const percentageLessGrow = percentage - growth;
    const competitors = this.competitors.others.competitors().filter((competitor) => !competitor.isExluded);

    const competitorPercentage =
      competitors
        .map((competitor) => {
          const selectedCount = competitor.rating?.find((item) => item.rating === rating)?.totalCount || 0;
          const totalCount = competitor.rating?.reduce((acc, curr) => acc + curr.totalCount, 0);

          return (selectedCount / totalCount) * 100;
        })
        .flat()
        .reduce((acc, curr) => acc + curr, 0) / competitors.length;

    return {
      count,
      percentage,
      received,
      growth,
      percentageLessGrow,
      competitorPercentage,
    };
  }
}
