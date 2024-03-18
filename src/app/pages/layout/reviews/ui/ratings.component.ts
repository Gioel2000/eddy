import { Component, computed, inject } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { ReviewsStore } from '../../../../store/reviews/reviews.service';

@Component({
  selector: 'ratings-graph',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, NumberPipe],
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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[525px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div #container class="flex flex-col sticky top-0 pt-8">
      @switch (summaryState()) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-col items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'REVIEWS' | translate }}
          </dt>
          <div class="flex flex-row items-center gap-x-3">
            <div class="flex flex-row items-center gap-x-3 w-full">
              <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-900 dark:text-zinc-100">
                {{ totalRating() | numb : translate.currentLang : 1 }}
              </dd>
            </div>
            <div class="flex flex-col items-start gap-y-1">
              <div class="flex flex-row items-center mr-4">
                <div class="flex items-center">
                  <svg
                    [ngClass]="{
                      'text-yellow-400': totalRating() >= 1,
                      'text-zinc-200 dark:text-zinc-700': totalRating() < 1
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <svg
                    [ngClass]="{
                      'text-yellow-400': totalRating() >= 2,
                      'text-zinc-200 dark:text-zinc-700': totalRating() < 2
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <svg
                    [ngClass]="{
                      'text-yellow-400': totalRating() >= 3,
                      'text-zinc-200 dark:text-zinc-700': totalRating() < 3
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <svg
                    [ngClass]="{
                      'text-yellow-400': totalRating() >= 4,
                      'text-zinc-200 dark:text-zinc-700': totalRating() < 4
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <svg
                    [ngClass]="{
                      'text-yellow-400': totalRating() >= 5,
                      'text-zinc-200 dark:text-zinc-700': totalRating() < 5
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                  >
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </div>
                <p class="sr-only">4 out of 5 stars</p>
              </div>
              <p class="text-sm  font-medium tabular-nums text-zinc-400 dark:text-zinc-600">
                {{ totalReviews() | numb : translate.currentLang }}
                {{ 'REVIEWS' | translate }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-900 dark:text-zinc-100">
                  5<span class="sr-only"> star reviews</span>
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div
                      class="h-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                    ></div>
                    @if (getStarData(5).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-500 dark:text-zinc-100">
                  {{ getStarData(5).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-400 dark:text-zinc-100">
                  {{ getStarData(5).percentage | numb : translate.currentLang : 0 }}%
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-900 dark:text-zinc-100">
                  4<span class="sr-only"> star reviews</span>
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div
                      class="h-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                    ></div>
                    @if (getStarData(4).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-500 dark:text-zinc-100">
                  {{ getStarData(4).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-400 dark:text-zinc-100">
                  {{ getStarData(4).percentage | numb : translate.currentLang : 0 }}%
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-900 dark:text-zinc-100">
                  3<span class="sr-only"> star reviews</span>
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div
                      class="h-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                    ></div>
                    @if (getStarData(3).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-500 dark:text-zinc-100">
                  {{ getStarData(3).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-400 dark:text-zinc-100">
                  {{ getStarData(3).percentage | numb : translate.currentLang : 0 }}%
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-900 dark:text-zinc-100">
                  2<span class="sr-only"> star reviews</span>
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div
                      class="h-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                    ></div>

                    @if (getStarData(2).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-500 dark:text-zinc-100">
                  {{ getStarData(2).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-400 dark:text-zinc-100">
                  {{ getStarData(2).percentage | numb : translate.currentLang : 0 }}%
                </dd>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-3 font-medium text-zinc-900 dark:text-zinc-100">
                  1<span class="sr-only"> star reviews</span>
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <g fill="currentColor">
                      <path
                        d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <div class="relative ml-3 flex-1">
                    <div
                      class="h-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                    ></div>
                    @if (getStarData(1).percentage; as percentage) {
                    <div
                      [style.width.%]="percentage"
                      class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                    ></div>
                    }
                  </div>
                </div>
              </dt>
              <div class="flex flex-row items-center justify-end">
                <dd class="w-8 text-right font-medium text-sm tabular-nums text-zinc-500 dark:text-zinc-100">
                  {{ getStarData(1).count | numb : translate.currentLang : 0 }}
                </dd>
                <dd class="w-12 text-right font-medium text-sm tabular-nums text-zinc-400 dark:text-zinc-100">
                  {{ getStarData(1).percentage | numb : translate.currentLang : 0 }}%
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
  summary = inject(ReviewsStore).summary;
  summaryState = inject(ReviewsStore).summaryState;
  translate = inject(TranslateService);

  totalReviews = computed(() => this.summary().count);
  totalRating = computed(() => this.summary().rating);

  getStarData(rating: number) {
    const row = this.summary().ratingGrouped.find((item) => item.rating === rating);
    const count = row?.count || 0;
    const percentage = (count / this.totalReviews()) * 100;

    return {
      count,
      percentage,
    };
  }
}
