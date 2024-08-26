import { Component, Signal, Type, computed, effect, inject, signal } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../utils/pipes/growth.pipe';
import { TypeTO } from '../../../../store/dashboard/interfaces/dashboard';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ReviewsService } from '../../reviews/reviews.service';
import { Router } from '@angular/router';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'types-graph',
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
            {{ 'CUSTOMER_TYPES' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-2 gap-4 2xl:grid-cols-4">
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkType('Family')"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {{ 'FAMILY' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ family().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      @if (family().growthRating) {
                      <span
                        class="text-sm px-1 font-semibold tabular-nums relative -top-0.5"
                        [ngClass]="{
                          'text-red-500': family().growthRating < 0,
                          'text-green-500': family().growthRating > 0,
                          'text-zinc-500': family().growthRating === 0
                        }"
                        >{{ family().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap mt-1">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - family().totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="'crowd.svg'"
                ></span>
              </a>

              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkType('Couple')"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>

                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {{ 'COUPLE' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ couple().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      @if (couple().growthRating) {
                      <span
                        class="text-sm px-1 font-semibold tabular-nums relative -top-0.5"
                        [ngClass]="{
                          'text-red-500': couple().growthRating < 0,
                          'text-green-500': couple().growthRating > 0,
                          'text-zinc-500': couple().growthRating === 0
                        }"
                        >{{ couple().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap mt-1">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - couple().totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="'users-3.svg'"
                ></span>
              </a>

              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkType('Solo')"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>

                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {{ 'SOLO' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ solo().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      @if (solo().growthRating) {
                      <span
                        class="text-sm px-1 font-semibold tabular-nums relative -top-0.5"
                        [ngClass]="{
                          'text-red-500': solo().growthRating < 0,
                          'text-green-500': solo().growthRating > 0,
                          'text-zinc-500': solo().growthRating === 0
                        }"
                        >{{ solo().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap mt-1">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - solo().totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="'user.svg'"
                ></span>
              </a>

              <a
                class="group relative flex items-center space-x-3 rounded-[10px] min-h-32 bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] p-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkType('Business')"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>

                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {{ 'BUSINESS' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ business().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      @if (business().growthRating) {
                      <span
                        class="text-sm px-1 font-semibold tabular-nums relative -top-0.5"
                        [ngClass]="{
                          'text-red-500': business().growthRating < 0,
                          'text-green-500': business().growthRating > 0,
                          'text-zinc-500': business().growthRating === 0
                        }"
                        >{{ business().growthRating | growth : translate.currentLang }}</span
                      >
                      }
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap mt-1">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - business().totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="'suitcase-6.svg'"
                ></span>
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
export class TypesComponent {
  store = inject(DashboardStore).typologies;
  translate = inject(TranslateService);
  reviews = inject(ReviewsService);
  router = inject(Router);

  family = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
    growthCount: 0,
  });

  couple = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
    growthCount: 0,
  });

  solo = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
    growthCount: 0,
  });

  business = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
    growthRating: 0,
    growthCount: 0,
  });

  constructor() {
    toObservable(this.store)
      .pipe(map((store) => store.data))
      .subscribe((data) => {
        this.family.set(this.filterByType(data, 'family'));
        this.couple.set(this.filterByType(data, 'couple'));
        this.solo.set(this.filterByType(data, 'solo'));
        this.business.set(this.filterByType(data, 'business'));
      });
  }

  checkType(type: 'Family' | 'Couple' | 'Solo' | 'Business') {
    this.reviews.filter.set({
      startdate: undefined,
      enddate: undefined,
      channels: ['thefork', 'tripadvisor', 'google'],
      offset: 0,
      rows: 5,
      sentimentCategories: [],
      sentimentWords: [],
      clients: [type],
      rating: undefined,
    });

    this.router.navigate(['/reviews']);
  }

  private filterByType(data: TypeTO[], clientType: string) {
    const type =
      data.find((type) => type.clientType.toLowerCase() === clientType) ||
      ({
        totalCount: 0,
        filteredCount: 0,
        totalRating: 0,
        filteredRating: 0,
      } as TypeTO);

    const { totalCount, filteredCount, totalRating, filteredRating } = type;

    return {
      totalCount,
      filteredCount,
      totalRating,
      filteredRating,
      growthCount: filteredCount,
      growthRating: this.growthRating(type),
    };
  }

  private growthRating(rating: TypeTO) {
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
