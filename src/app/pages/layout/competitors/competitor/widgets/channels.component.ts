import { Component, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { StateModel } from '../../../../../store/competitors/interfaces/competitors';
import { CompetitorsService } from '../../competitors.service';

@Component({
  selector: 'channels-graph',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, NumberPipe, GrowthPipe],
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
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div
      #container
      class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 px-px py-6 h-[32rem] overflow-y-auto"
    >
      @switch (state()) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'CHANNELS' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-1 gap-4">
              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] ring-1 ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm shadow-black/5"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/google.svg'"
                      class="svg-icon svg-icon-1 text-zinc-200 stroke-[1.7]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1 ml-2">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">{{ 'GOOGLE' | translate }}</p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - google().totalRating) * 20"
                        ></div>
                      </div>
                      <p
                        class="flex flex-row ml-1 font-semibold w-8 text-sm tabular-nums text-zinc-700 dark:text-zinc-300"
                      >
                        <span>{{ google().totalRating | numb : translate.currentLang : 2 }}</span>
                        <!-- @if (google().filteredRating) {
                        <div
                          class="flex flex-row items-center gap-x-0.5 ml-2 font-semibold text-[0.70rem] tabular-nums py-px px-1 rounded bg-green-800"
                          [ngClass]="{
                            'bg-red-800 text-red-500': google().filteredRating < 0,
                            'bg-green-800 text-green-500': google().filteredRating > 0,
                            'bg-zinc-800 text-zinc-500': google().filteredRating === 0
                          }"
                        >
                          @if (google().filteredRating > 0) {
                          <span [inlineSVG]="'arrow-up.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          } @if (google().filteredRating < 0) {
                          <span [inlineSVG]="'arrow-down.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          } @if (google().filteredRating == 0) {
                          <span [inlineSVG]="'priority-normal.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          }

                          <span>{{ google().filteredRating | numb : translate.currentLang : 2 }}</span>
                        </div>
                        } -->
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ google().totalCount | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - getCompetitorRating('google')) * 20"
                        ></div>
                      </div>
                      <p class="ml-1 font-semibold text-sm w-8 tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ getCompetitorRating('google') | numb : translate.currentLang : 2 }}</span>
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ getCompetitorCount('google') | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    @if((google().totalRating - getCompetitorRating('google')); as diffRating) {
                    @if((google().totalCount - getCompetitorCount('google')); as diffCount) {
                    <div class="flex flex-row items-center text-xs font-semibold mt-1.5">
                      <span
                        class="w-20 truncate mr-1"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ 'DIFFERENCE' | translate }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ diffRating | growth : translate.currentLang : 1 }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffCount > 0,
                          'text-red-500': diffCount < 0,
                          'text-zinc-700': diffCount === 0
                        }"
                        >{{ diffCount | growth : translate.currentLang : 1 }}</span
                      >
                    </div>
                    } }

                    <!-- <p class="text-sm font-medium tabular-nums text-zinc-700">
                      {{ google().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (google().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'bg-red-800 text-red-500': google().filteredCount < 0,
                          'bg-green-800 text-green-500': google().filteredCount > 0,
                          'bg-zinc-800 text-zinc-500': google().filteredCount === 0
                        }"
                        >{{ google().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p> -->
                  </div>
                </div>
              </div>

              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] ring-1 ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm shadow-black/5"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/tripadvisor.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-emerald-500"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1 ml-2">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                      {{ 'TRIPADVISOR' | translate }}
                    </p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - tripadvisor().totalRating) * 20"
                        ></div>
                      </div>
                      <p
                        class="flex flex-row ml-1 font-semibold w-8 text-sm tabular-nums text-zinc-700 dark:text-zinc-300"
                      >
                        <span>{{ tripadvisor().totalRating | numb : translate.currentLang : 2 }}</span>
                        <!-- @if (tripadvisor().filteredRating) {
                        <div
                          class="flex flex-row items-center gap-x-0.5 ml-2 font-semibold text-[0.70rem] tabular-nums py-px px-1 rounded bg-green-800"
                          [ngClass]="{
                            'bg-red-800 text-red-500': tripadvisor().filteredRating < 0,
                            'bg-green-800 text-green-500': tripadvisor().filteredRating > 0,
                            'bg-zinc-800 text-zinc-500': tripadvisor().filteredRating === 0
                          }"
                        >
                          @if (tripadvisor().filteredRating > 0) {
                          <span [inlineSVG]="'arrow-up.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          } @if (tripadvisor().filteredRating < 0) {
                          <span [inlineSVG]="'arrow-down.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          } @if (tripadvisor().filteredRating == 0) {
                          <span [inlineSVG]="'priority-normal.svg'" class="svg-icon svg-icon-9 stroke-[1.5]"></span>
                          }

                          <span>{{ tripadvisor().filteredRating | numb : translate.currentLang : 2 }}</span>
                        </div>
                        } -->
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ tripadvisor().totalCount | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - getCompetitorRating('tripadvisor')) * 20"
                        ></div>
                      </div>
                      <p class="ml-1 font-semibold text-sm w-8 tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ getCompetitorRating('tripadvisor') | numb : translate.currentLang : 2 }}</span>
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ getCompetitorCount('tripadvisor') | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    @if((tripadvisor().totalRating - getCompetitorRating('tripadvisor')); as diffRating) {
                    @if((tripadvisor().totalCount - getCompetitorCount('tripadvisor')); as diffCount) {
                    <div
                      class="flex flex-row items-center text-xs font-semibold mt-1.5"
                      [ngClass]="{
                        'text-green-500': diffRating > 0,
                        'text-red-500': diffRating < 0,
                        'text-zinc-700': diffRating === 0
                      }"
                    >
                      <span
                        class="w-20 truncate mr-1"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ 'DIFFERENCE' | translate }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ diffRating | growth : translate.currentLang : 1 }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffCount > 0,
                          'text-red-500': diffCount < 0,
                          'text-zinc-700': diffCount === 0
                        }"
                        >{{ diffCount | growth : translate.currentLang : 1 }}</span
                      >
                    </div>
                    } }

                    <!-- <p class="text-sm font-medium tabular-nums text-zinc-700">
                      {{ tripadvisor().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (tripadvisor().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'bg-red-800 text-red-500': tripadvisor().filteredCount < 0,
                          'bg-green-800 text-green-500': tripadvisor().filteredCount > 0,
                          'bg-zinc-800 text-zinc-500': tripadvisor().filteredCount === 0
                        }"
                        >{{ tripadvisor().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p> -->
                  </div>
                </div>
              </div>

              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] ring-1 ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm shadow-black/5"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/TheFork.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-[#00ab97]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1 ml-2">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">{{ 'THE_FORK' | translate }}</p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - thefork().totalRating) * 20"
                        ></div>
                      </div>
                      <p
                        class="flex flex-row ml-1 font-semibold w-8 text-sm tabular-nums text-zinc-700 dark:text-zinc-300"
                      >
                        <span>{{ thefork().totalRating | numb : translate.currentLang : 2 }}</span>
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ thefork().totalCount | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - getCompetitorRating('thefork')) * 20"
                        ></div>
                      </div>
                      <p class="ml-1 font-semibold text-sm w-8 tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ getCompetitorRating('thefork') | numb : translate.currentLang : 2 }}</span>
                      </p>
                      <p
                        class="flex flex-row items-center ml-1 font-semibold text-sm tabular-nums text-zinc-300 dark:text-zinc-700"
                      >
                        {{ getCompetitorCount('thefork') | numb : translate.currentLang : 2 }}
                      </p>
                    </div>

                    @if((thefork().totalRating - getCompetitorRating('thefork')); as diffRating) {
                    @if((thefork().totalCount - getCompetitorCount('thefork')); as diffCount) {
                    <div
                      class="flex flex-row items-center text-xs font-semibold mt-1.5"
                      [ngClass]="{
                        'text-green-500': diffRating > 0,
                        'text-red-500': diffRating < 0,
                        'text-zinc-700': diffRating === 0
                      }"
                    >
                      <span
                        class="w-20 truncate mr-1"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ 'DIFFERENCE' | translate }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffRating > 0,
                          'text-red-500': diffRating < 0,
                          'text-zinc-700': diffRating === 0
                        }"
                        >{{ diffRating | growth : translate.currentLang : 1 }}</span
                      >
                      <span
                        class="w-8"
                        [ngClass]="{
                          'text-green-500': diffCount > 0,
                          'text-red-500': diffCount < 0,
                          'text-zinc-700': diffCount === 0
                        }"
                        >{{ diffCount | growth : translate.currentLang : 1 }}</span
                      >
                    </div>
                    } }

                    <!-- <p class="text-sm font-medium tabular-nums text-zinc-700">
                      {{ thefork().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (thefork().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'bg-red-800 text-red-500': thefork().filteredCount < 0,
                          'bg-green-800 text-green-500': thefork().filteredCount > 0,
                          'bg-zinc-800 text-zinc-500': thefork().filteredCount === 0
                        }"
                        >{{ thefork().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p> -->
                  </div>
                </div>
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
export class ChannelsComponent {
  id = input.required<string>();
  channelsRatings = input.required<any[]>();
  state = input.required<StateModel>();
  translate = inject(TranslateService);
  competitors = inject(CompetitorsService);

  google = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
  });

  thefork = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
  });

  tripadvisor = signal({
    totalCount: 0,
    filteredCount: 0,
    totalRating: 0,
    filteredRating: 0,
  });

  constructor() {
    toObservable(this.channelsRatings).subscribe((data) => {
      const google = data.find((channel) => channel.channel === 'google');
      const thefork = data.find((channel) => channel.channel === 'thefork');
      const tripadvisor = data.find((channel) => channel.channel === 'tripadvisor');

      google && this.google.set(google);
      thefork && this.thefork.set(thefork);
      tripadvisor && this.tripadvisor.set(tripadvisor);
    });
  }

  getCompetitorRating(channelSelected: string) {
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const competitors = [
      ...this.competitors.others
        .competitors()
        .filter((competitor) => !competitor.isExluded)
        .filter((competitor) => competitor._id !== this.id())
        .map((competitor) => competitor.channelsRatings)
        .flat(),
      ...this.competitors.you.channels().data,
    ];

    const channels = competitors
      .filter((rating) => rating.channel === channelSelected)
      .filter((rating) => rating.totalRating > 0);

    const channelAverageRating = channels.reduce((acc, channel) => acc + channel.totalRating, 0) / channels.length;

    return channelAverageRating;
  }

  getCompetitorCount(channelSelected: string) {
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const competitors = [
      ...this.competitors.others
        .competitors()
        .filter((competitor) => !competitor.isExluded)
        .filter((competitor) => competitor._id !== this.id())
        .map((competitor) => competitor.channelsRatings)
        .flat(),
      ...this.competitors.you.channels().data,
    ];

    const channels = competitors
      .filter((rating) => rating.channel === channelSelected)
      .filter((rating) => rating.totalCount > 0);

    const channelAverageRating = channels.reduce((acc, channel) => acc + channel.totalCount, 0) / channels.length;

    return channelAverageRating;
  }
}
