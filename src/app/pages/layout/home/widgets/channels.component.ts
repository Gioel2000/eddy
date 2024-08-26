import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../utils/pipes/growth.pipe';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import { ReviewsService } from '../../reviews/reviews.service';
import { Router } from '@angular/router';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChannelTO } from '../../../../store/dashboard/interfaces/dashboard';

@UntilDestroy()
@Component({
  selector: 'channels-graph',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    InlineSVGModule,
    TranslateModule,
    NumberPipe,
    GrowthPipe,
    MissingTranslationPipe,
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

    <div #container class="flex flex-col py-3">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'CHANNELS' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-2">
            <div class="grid grid-cols-2 sm:grid-cols-1 gap-4 2xl:grid-cols-3">
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="google().totalCount && checkChannel('google')"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !google().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/google.svg'"
                      class="svg-icon svg-icon-1 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between mb-1">
                      <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'GOOGLE' | translate }}</p>
                    </div>
                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-900 dark:text-zinc-300">
                        <span>{{ google().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                      @if (google().growthRating) {
                      <span
                        class="text-sm font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': google().growthRating < 0,
                          'text-green-500': google().growthRating > 0,
                          'text-zinc-500': google().growthRating === 0
                        }"
                        >{{ google().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-400 dark:text-zinc-600 lowercase"
                    >
                      {{ google().totalCount | numb : translate.currentLang : 1 }}
                      <span class="truncate mx-0.5">{{ 'REVIEWS' | translate }}</span>
                      @if (google().filteredCount) {
                      <span
                        class="ml-0.5 font-semibold tabular-nums text-sm"
                        [ngClass]="{
                          'text-red-500': google().filteredCount < 0,
                          'text-green-500': google().filteredCount > 0,
                          'text-zinc-500': google().filteredCount === 0
                        }"
                        >{{ google().filteredCount | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                  </div>
                </div>
              </a>
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="tripadvisor().totalCount && checkChannel('tripadvisor')"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !tripadvisor().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/tripadvisor.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between mb-1">
                      <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'TRIPADVISOR' | translate }}</p>
                    </div>
                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-900 dark:text-zinc-300">
                        <span>{{ tripadvisor().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                      @if (tripadvisor().growthRating) {
                      <span
                        class="text-sm font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': tripadvisor().growthRating < 0,
                          'text-green-500': tripadvisor().growthRating > 0,
                          'text-zinc-500': tripadvisor().growthRating === 0
                        }"
                        >{{ tripadvisor().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-400 dark:text-zinc-600 lowercase"
                    >
                      {{ tripadvisor().totalCount | numb : translate.currentLang : 1 }}
                      <span class="truncate mx-0.5">{{ 'REVIEWS' | translate }}</span>
                      @if (tripadvisor().filteredCount) {
                      <span
                        class="ml-0.5 font-semibold tabular-nums text-sm"
                        [ngClass]="{
                          'text-red-500': tripadvisor().filteredCount < 0,
                          'text-green-500': tripadvisor().filteredCount > 0,
                          'text-zinc-500': tripadvisor().filteredCount === 0
                        }"
                        >{{ tripadvisor().filteredCount | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                  </div>
                </div>
              </a>
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="thefork().totalCount && checkChannel('thefork')"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !thefork().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/TheFork.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-[#005f54] dark:text-[#00ab97]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between mb-1">
                      <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'THE_FORK' | translate }}</p>
                    </div>

                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-900 dark:text-zinc-300">
                        <span>{{ thefork().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                      @if (thefork().growthRating) {
                      <span
                        class="text-sm font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': thefork().growthRating < 0,
                          'text-green-500': thefork().growthRating > 0,
                          'text-zinc-500': thefork().growthRating === 0
                        }"
                        >{{ thefork().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-400 dark:text-zinc-600 lowercase"
                    >
                      {{ thefork().totalCount | numb : translate.currentLang : 1 }}
                      <span class="truncate mx-0.5">{{ 'REVIEWS' | translate }}</span>
                      @if (thefork().filteredCount) {
                      <span
                        class="ml-0.5 font-semibold tabular-nums text-sm"
                        [ngClass]="{
                          'text-red-500': thefork().filteredCount < 0,
                          'text-green-500': thefork().filteredCount > 0,
                          'text-zinc-500': thefork().filteredCount === 0
                        }"
                        >{{ thefork().filteredCount | growth : translate.currentLang }}</span
                      >
                      }
                    </div>
                  </div>
                </div>
              </a>
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
export class ChannelsComponent {
  store = inject(DashboardStore).channels;
  translate = inject(TranslateService);
  reviews = inject(ReviewsService);
  router = inject(Router);

  google = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
  });

  thefork = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
  });

  tripadvisor = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
  });

  constructor() {
    toObservable(this.store)
      .pipe(
        untilDestroyed(this),
        map((store) => store.data)
      )
      .subscribe((data) => {
        const empty = {
          totalCount: 0,
          filteredCount: 0,
          totalRating: 0,
          filteredRating: 0,
          growthRating: 0,
        };

        const google = data.find((channel) => channel.channel === 'google');
        const thefork = data.find((channel) => channel.channel === 'thefork');
        const tripadvisor = data.find((channel) => channel.channel === 'tripadvisor');

        this.google.set(empty);
        this.thefork.set(empty);
        this.tripadvisor.set(empty);

        google && this.google.set({ ...google, growthRating: this.growthRating(google) });
        thefork && this.thefork.set({ ...thefork, growthRating: this.growthRating(thefork) });
        tripadvisor && this.tripadvisor.set({ ...tripadvisor, growthRating: this.growthRating(tripadvisor) });
      });
  }

  checkChannel(channel: string) {
    this.reviews.filter.set({
      startdate: undefined,
      enddate: undefined,
      clients: [],
      offset: 0,
      rows: 5,
      sentimentCategories: [],
      sentimentWords: [],
      channels: [channel],
      rating: undefined,
    });

    this.router.navigate(['/reviews']);
  }

  private growthRating(rating: ChannelTO) {
    const actualRating = rating.totalRating;
    const actualReview = rating.totalCount;
    const totalStars = actualRating * actualReview;

    const newRating = rating.totalRating + rating.filteredRating;
    const newReview = rating.filteredCount;
    const newStars = newRating * newReview;

    const newTotalStars = totalStars + newStars;
    const newTotalReview = actualReview + newReview;

    const weightedAverage = newTotalStars / newTotalReview;
    const growth = weightedAverage - actualRating;

    return growth;
  }
}
