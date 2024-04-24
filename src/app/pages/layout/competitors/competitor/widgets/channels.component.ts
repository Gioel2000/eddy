import { Component, Signal, computed, effect, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { StateModel } from '../../../../../store/competitors/interfaces/competitors';

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

    <div
      #container
      class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 px-px py-6 h-[30rem] overflow-y-auto"
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
                class="relative flex items-center min-h-[112px] space-x-3 rounded-xl bg-white dark:bg-dark shadow-black/5 ring-1  ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/google.svg'"
                      class="svg-icon-1 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'GOOGLE' | translate }}</p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex items-center py-1">
                        <svg
                          [ngClass]="{
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': google().totalRating >= 1,
                            'text-zinc-200 dark:text-zinc-700': google().totalRating < 1
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': google().totalRating >= 2,
                            'text-zinc-200 dark:text-zinc-700': google().totalRating < 2
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': google().totalRating >= 3,
                            'text-zinc-200 dark:text-zinc-700': google().totalRating < 3
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': google().totalRating >= 4,
                            'text-zinc-200 dark:text-zinc-700': google().totalRating < 4
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': google().totalRating >= 5,
                            'text-zinc-200 dark:text-zinc-700': google().totalRating < 5
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
                      <p class="ml-1 font-semibold text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ google().totalRating | numb : translate.currentLang : 2 }}</span>
                        @if (google().filteredRating) {
                        <span
                          class="pl-1.5 px-1 font-semibold text-sm tabular-nums"
                          [ngClass]="{
                            'text-red-500': google().filteredRating < 0,
                            'text-green-500': google().filteredRating > 0,
                            'text-zinc-500': google().filteredRating === 0
                          }"
                          >{{ google().filteredRating | growth : translate.currentLang : 2 }}</span
                        >
                        }
                      </p>
                    </div>
                    <p class="text-sm font-medium tabular-nums text-zinc-300 dark:text-zinc-700">
                      {{ google().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (google().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': google().filteredCount < 0,
                          'text-green-500': google().filteredCount > 0,
                          'text-zinc-500': google().filteredCount === 0
                        }"
                        >{{ google().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-xl bg-white dark:bg-dark shadow-black/5 ring-1  ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/tripadvisor.svg'"
                      class="svg-icon-1 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'TRIPADVISOR' | translate }}</p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex items-center py-1">
                        <svg
                          [ngClass]="{
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]':
                              tripadvisor().totalRating >= 1,
                            'text-zinc-200 dark:text-zinc-700': tripadvisor().totalRating < 1
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]':
                              tripadvisor().totalRating >= 2,
                            'text-zinc-200 dark:text-zinc-700': tripadvisor().totalRating < 2
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]':
                              tripadvisor().totalRating >= 3,
                            'text-zinc-200 dark:text-zinc-700': tripadvisor().totalRating < 3
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]':
                              tripadvisor().totalRating >= 4,
                            'text-zinc-200 dark:text-zinc-700': tripadvisor().totalRating < 4
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]':
                              tripadvisor().totalRating >= 5,
                            'text-zinc-200 dark:text-zinc-700': tripadvisor().totalRating < 5
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
                      <p class="ml-1 font-semibold text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ tripadvisor().totalRating | numb : translate.currentLang : 2 }}</span>
                        @if (tripadvisor().filteredRating) {
                        <span
                          class="pl-1.5 px-1 font-semibold text-sm tabular-nums"
                          [ngClass]="{
                            'text-red-500': tripadvisor().filteredRating < 0,
                            'text-green-500': tripadvisor().filteredRating > 0,
                            'text-zinc-500': tripadvisor().filteredRating === 0
                          }"
                          >{{ tripadvisor().filteredRating | growth : translate.currentLang : 2 }}</span
                        >
                        }
                      </p>
                    </div>
                    <p class="text-sm font-medium tabular-nums text-zinc-300 dark:text-zinc-700">
                      {{ tripadvisor().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (tripadvisor().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': tripadvisor().filteredCount < 0,
                          'text-green-500': tripadvisor().filteredCount > 0,
                          'text-zinc-500': tripadvisor().filteredCount === 0
                        }"
                        >{{ tripadvisor().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-xl bg-white dark:bg-dark shadow-black/5 ring-1  ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/TheFork.svg'"
                      class="svg-icon-1 stroke-[1.8] text-[#005f54] dark:text-[#00ab97]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ 'THE_FORK' | translate }}</p>
                    <div class="flex items-center xl:col-span-1">
                      <div class="flex items-center py-1">
                        <svg
                          [ngClass]="{
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': thefork().totalRating >= 1,
                            'text-zinc-200 dark:text-zinc-700': thefork().totalRating < 1
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': thefork().totalRating >= 2,
                            'text-zinc-200 dark:text-zinc-700': thefork().totalRating < 2
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': thefork().totalRating >= 3,
                            'text-zinc-200 dark:text-zinc-700': thefork().totalRating < 3
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': thefork().totalRating >= 4,
                            'text-zinc-200 dark:text-zinc-700': thefork().totalRating < 4
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': thefork().totalRating >= 5,
                            'text-zinc-200 dark:text-zinc-700': thefork().totalRating < 5
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
                      <p class="ml-1 font-semibold text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span>{{ thefork().totalRating | numb : translate.currentLang : 2 }}</span>
                        @if (thefork().filteredRating) {
                        <span
                          class="pl-1.5 px-1 font-semibold text-sm tabular-nums"
                          [ngClass]="{
                            'text-red-500': thefork().filteredRating < 0,
                            'text-green-500': thefork().filteredRating > 0,
                            'text-zinc-500': thefork().filteredRating === 0
                          }"
                          >{{ thefork().filteredRating | growth : translate.currentLang : 2 }}</span
                        >
                        }
                      </p>
                    </div>
                    <p class="text-sm font-medium tabular-nums text-zinc-300 dark:text-zinc-700">
                      {{ thefork().totalCount | numb : translate.currentLang : 2 }}
                      {{ 'REVIEWS' | translate }}
                      @if (thefork().filteredCount) {
                      <span
                        class="px-1 font-semibold tabular-nums"
                        [ngClass]="{
                          'text-red-500': thefork().filteredCount < 0,
                          'text-green-500': thefork().filteredCount > 0,
                          'text-zinc-500': thefork().filteredCount === 0
                        }"
                        >{{ thefork().filteredCount | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </p>
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
  channelsRatings = input.required<any[]>();
  state = input.required<StateModel>();
  translate = inject(TranslateService);

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

      if (google) {
        this.google.set({
          totalCount: google.totalCount,
          filteredCount: google.filteredCount,
          totalRating: google.totalRating,
          filteredRating: google.filteredRating,
        });
      }

      if (thefork) {
        this.thefork.set({
          totalCount: thefork.totalCount,
          filteredCount: thefork.filteredCount,
          totalRating: thefork.totalRating,
          filteredRating: thefork.filteredRating,
        });
      }

      if (tripadvisor) {
        this.tripadvisor.set({
          totalCount: tripadvisor.totalCount,
          filteredCount: tripadvisor.filteredCount,
          totalRating: tripadvisor.totalRating,
          filteredRating: tripadvisor.filteredRating,
        });
      }
    });
  }
}
