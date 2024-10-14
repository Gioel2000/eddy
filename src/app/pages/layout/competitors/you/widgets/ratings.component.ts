import { Component, computed, effect, inject } from '@angular/core';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { CompetitorsService } from '../../competitors.service';
import { MissingTranslationPipe } from '../../../../../utils/pipes/missingTranslation.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { TooltipComponent } from '../../../../../ui/tooltip/tooltip.component';

@Component({
  selector: 'ratings-graph',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    InlineSVGModule,
    TranslateModule,
    NumberPipe,
    MissingTranslationPipe,
    GrowthPipe,
    TooltipComponent,
  ],
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

    <ng-template #better>
      <tooltip position="top-right" label="{{ 'BETTER_THEN_YOUR_COMPETITOR' | translate }}">
        <a class="flex flex-row items-center cursor-pointer w-full p-2 rounded-lg hover:bg-zinc-800 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="h-4.5 w-4.5">
            <g fill="currentColor">
              <path
                d="M16.331,7.073c-.525-.682-1.319-1.073-2.179-1.073h-3.326l.798-2.167c.463-1.256-.091-2.655-1.289-3.254-.307-.153-.679-.079-.903,.181L5.168,5.697c-.431,.5-.668,1.138-.668,1.797v5.756c0,1.517,1.234,2.75,2.75,2.75h5.71c1.246,0,2.339-.841,2.659-2.046l1.191-4.5c.22-.832,.045-1.699-.479-2.381Z"
              ></path>
              <path
                d="M4.25,16h-1.5c-.965,0-1.75-.785-1.75-1.75V7.75c0-.965,.785-1.75,1.75-1.75h1.5c.965,0,1.75,.785,1.75,1.75v6.5c0,.965-.785,1.75-1.75,1.75ZM2.75,7.5c-.138,0-.25,.112-.25,.25v6.5c0,.138,.112,.25,.25,.25h1.5c.138,0,.25-.112,.25-.25V7.75c0-.138-.112-.25-.25-.25h-1.5Z"
              ></path>
            </g>
          </svg>
        </a>
      </tooltip>
    </ng-template>

    <ng-template #worse>
      <tooltip position="top-right" label="{{ 'WORSE_THEN_YOUR_COMPETITOR' | translate }}">
        <a class="flex flex-row items-center cursor-pointer w-full p-2 rounded-lg hover:bg-zinc-800 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="h-4.5 w-4.5">
            <g fill="currentColor">
              <path
                d="M16.81,8.546l-1.191-4.5c-.319-1.205-1.413-2.046-2.659-2.046H7.25c-1.516,0-2.75,1.233-2.75,2.75v5.756c0,.659,.237,1.297,.669,1.797l4.264,4.937c.146,.169,.355,.26,.568,.26,.113,0,.228-.026,.335-.079,1.197-.599,1.751-1.998,1.289-3.254l-.798-2.167h3.326c.86,0,1.654-.391,2.179-1.073,.524-.682,.699-1.549,.479-2.381Z"
              ></path>
              <path
                d="M4.25,12h-1.5c-.965,0-1.75-.785-1.75-1.75V3.75c0-.965,.785-1.75,1.75-1.75h1.5c.965,0,1.75,.785,1.75,1.75v6.5c0,.965-.785,1.75-1.75,1.75ZM2.75,3.5c-.138,0-.25,.112-.25,.25v6.5c0,.138,.112,.25,.25,.25h1.5c.138,0,.25-.112,.25-.25V3.75c0-.138-.112-.25-.25-.25h-1.5Z"
              ></path>
            </g>
          </svg>
        </a>
      </tooltip>
    </ng-template>

    <div #container class="flex flex-col border-b border-zinc-800 py-6">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 h-24">
          <dt class="text-sm font-medium leading-6 text-zinc-200">
            {{ 'REVIEWS' | translate }}
          </dt>
          @if (isReviewHigher() !== null) {
          <ng-container [ngTemplateOutlet]="isReviewHigher() ? better : worse"></ng-container>
          }
          <div class="flex flex-row items-center gap-x-3 w-full">
            <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-100">
              {{ totalReviews() | numb : translate.currentLang : 2 }}
            </dd>
            <dd
              class="flex flex-row items-center text-sm font-semibold tracking-tight leading-9 px-2 rounded-md gap-x-1"
              [ngClass]="{
                'text-green-600 bg-green-900': isPositive(),
                'text-zinc-500 bg-zinc-900': !isPositive(),
              }"
            >
              <span
                [inlineSVG]="isPositive() ? 'arrow-up.svg' : 'priority-normal.svg'"
                class="svg-icon svg-icon-7 stroke-2"
              ></span>
              <span> {{ totalReviewsReceived() | growth : translate.currentLang }}</span>
            </dd>
          </div>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">5<span class="sr-only"> star reviews</span></p>
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
                    @if (getStarData(5).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    } @if (getStarData(5).percentageLessGrow; as percentageLessGrow) {
                    <div
                      [style.width.%]="percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-100 ml-2">
                  {{ getStarData(5).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-500">
                  {{ getStarData(5).percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd
                  class="w-8 text-right font-semibold text-sm tabular-nums"
                  [ngClass]="{
                    'text-green-500': getStarData(5).received > 0,
                    'text-zinc-500': getStarData(5).received === 0
                  }"
                >
                  +{{ getStarData(5).received | numb : translate.currentLang : 0 }}
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">4<span class="sr-only"> star reviews</span></p>
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
                    @if (getStarData(4).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    } @if (getStarData(4).percentageLessGrow; as percentageLessGrow) {
                    <div
                      [style.width.%]="percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-100 ml-2">
                  {{ getStarData(4).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-500">
                  {{ getStarData(4).percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd
                  class="w-8 text-right font-semibold text-sm tabular-nums"
                  [ngClass]="{
                    'text-green-500': getStarData(4).received > 0,
                    'text-zinc-500': getStarData(4).received === 0
                  }"
                >
                  +{{ getStarData(4).received | numb : translate.currentLang : 0 }}
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">3<span class="sr-only"> star reviews</span></p>
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
                    @if (getStarData(3).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    } @if (getStarData(3).percentageLessGrow; as percentageLessGrow) {
                    <div
                      [style.width.%]="percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-100 ml-2">
                  {{ getStarData(3).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-500">
                  {{ getStarData(3).percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd
                  class="w-8 text-right font-semibold text-sm tabular-nums"
                  [ngClass]="{
                    'text-green-500': getStarData(3).received > 0,
                    'text-zinc-500': getStarData(3).received === 0
                  }"
                >
                  +{{ getStarData(3).received | numb : translate.currentLang : 0 }}
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">2<span class="sr-only"> star reviews</span></p>
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

                    @if (getStarData(2).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    } @if (getStarData(2).percentageLessGrow; as percentageLessGrow) {
                    <div
                      [style.width.%]="percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-100 ml-2">
                  {{ getStarData(2).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-500">
                  {{ getStarData(2).percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd
                  class="w-8 text-right font-semibold text-sm tabular-nums"
                  [ngClass]="{
                    'text-green-500': getStarData(2).received > 0,
                    'text-zinc-500': getStarData(2).received === 0
                  }"
                >
                  +{{ getStarData(2).received | numb : translate.currentLang : 0 }}
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-100">1<span class="sr-only"> star reviews</span></p>
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
                    @if (getStarData(1).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-green-400 bg-green-400"
                    ></div>
                    } @if (getStarData(1).percentageLessGrow; as percentageLessGrow) {
                    <div
                      [style.width.%]="percentageLessGrow"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-100 ml-2">
                  {{ getStarData(1).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-500">
                  {{ getStarData(1).percentage | numb : translate.currentLang : 0 }}%
                </dd>
                <dd
                  class="w-8 text-right font-semibold text-sm tabular-nums"
                  [ngClass]="{
                    'text-green-500': getStarData(1).received > 0,
                    'text-zinc-500': getStarData(1).received === 0
                  }"
                >
                  +{{ getStarData(1).received | numb : translate.currentLang : 0 }}
                </dd>
              </div>
            </div>
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

  isPositive = computed(() => {
    return this.totalReviewsReceived() > 0;
  });

  getStarData(rating: number) {
    const row = this.store().data.find((item) => item.rating === rating);
    const count = row?.totalCount || 0;
    const received = row?.filteredCount || 0;
    const percentage = (count / this.totalReviews()) * 100;
    const growth = (received / this.totalReviews()) * 100;
    const percentageLessGrow = percentage - growth;
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);

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

  isReviewHigher = computed(() => {
    const reviewsCount = this.totalReviews();
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);

    if (!competitors.length) return null;

    const reviewsCountCompetitors =
      competitors.reduce(
        (acc, competitor) => acc + (competitor?.rating || []).reduce((acc, curr) => acc + curr.totalCount, 0),
        0
      ) / competitors.length;

    return reviewsCount > reviewsCountCompetitors;
  });
}
