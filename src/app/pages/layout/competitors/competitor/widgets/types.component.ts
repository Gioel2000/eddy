import { Component, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { ClientTypeModel, StateModel } from '../../../../../store/competitors/interfaces/competitors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CompetitorsService } from '../../competitors.service';

@UntilDestroy()
@Component({
  selector: 'types-graph',
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
      class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 py-6 px-px h-[34rem] overflow-y-auto"
    >
      @switch (state()) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'CUSTOMER_TYPES' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <a
                class="group relative flex items-center space-x-3 min-h-36 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="flex flex-col gap-y-2">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm w-full font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ 'FAMILY' | translate }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - family().totalRating) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ family().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if (getClientypeVoteCompetitors('family'); as competitorVote) {
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - competitorVote) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ competitorVote | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if((+family().totalRating.toFixed(1) - +competitorVote.toFixed(1)); as diff) {
                    <div
                      class="flex flex-row items-center justify-between text-xs font-bold mt-1"
                      [ngClass]="{
                        'text-green-500': diff > 0,
                        'text-red-500': diff < 0,
                        'text-zinc-700': diff === 0
                      }"
                    >
                      <span class="w-full max-w-16 truncate">{{ 'DIFFERENCE' | translate }}</span>
                      <span></span>
                      <span>{{ diff | growth : translate.currentLang : 1 }}</span>
                    </div>
                    } }
                  </div>
                </div>
              </a>

              <a
                class="group relative flex items-center space-x-3 min-h-36 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="flex flex-col gap-y-2">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm w-full font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ 'COUPLE' | translate }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - couple().totalRating) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ couple().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if (getClientypeVoteCompetitors('couple'); as competitorVote) {
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - competitorVote) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ competitorVote | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if((+couple().totalRating.toFixed(1) - +competitorVote.toFixed(1)); as diff) {
                    <div
                      class="flex flex-row items-center justify-between text-xs font-bold mt-1"
                      [ngClass]="{
                        'text-green-500': diff > 0,
                        'text-red-500': diff < 0,
                        'text-zinc-700': diff === 0
                      }"
                    >
                      <span class="w-full max-w-16 truncate">{{ 'DIFFERENCE' | translate }}</span>
                      <span></span>
                      <span>{{ diff | growth : translate.currentLang : 1 }}</span>
                    </div>
                    } }
                  </div>
                </div>
              </a>

              <a
                class="group relative flex items-center space-x-3 min-h-36 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="flex flex-col gap-y-2">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm w-full font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ 'SOLO' | translate }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - solo().totalRating) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ solo().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if (getClientypeVoteCompetitors('solo'); as competitorVote) {
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - competitorVote) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ competitorVote | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if((+solo().totalRating.toFixed(1) - +competitorVote.toFixed(1)); as diff) {
                    <div
                      class="flex flex-row items-center justify-between text-xs font-bold mt-1"
                      [ngClass]="{
                        'text-green-500': diff > 0,
                        'text-red-500': diff < 0,
                        'text-zinc-700': diff === 0
                      }"
                    >
                      <span class="w-full max-w-16 truncate">{{ 'DIFFERENCE' | translate }}</span>
                      <span></span>
                      <span>{{ diff | growth : translate.currentLang : 1 }}</span>
                    </div>
                    } }
                  </div>
                </div>
              </a>

              <a
                class="group relative flex items-center space-x-3 min-h-36 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="flex flex-col gap-y-2">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm w-full font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ 'BUSINESS' | translate }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - business().totalRating) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ business().totalRating | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if (getClientypeVoteCompetitors('business'); as competitorVote) {
                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="fill-violet-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
                          viewBox="0 0 18 18"
                        >
                          <g>
                            <path
                              d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - competitorVote) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ competitorVote | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if((+business().totalRating.toFixed(1) - +competitorVote.toFixed(1)); as diff) {
                    <div
                      class="flex flex-row items-center justify-between text-xs font-bold mt-1"
                      [ngClass]="{
                        'text-green-500': diff > 0,
                        'text-red-500': diff < 0,
                        'text-zinc-700': diff === 0
                      }"
                    >
                      <span class="w-full max-w-16 truncate">{{ 'DIFFERENCE' | translate }}</span>
                      <span></span>
                      <span>{{ diff | growth : translate.currentLang : 1 }}</span>
                    </div>
                    } }
                  </div>
                </div>
              </a>
            </div>
          </dl>
        </div>
      </div>
      } }
    </div>
  `,
})
export class TypesComponent {
  id = input.required<string>();
  typologies = input.required<ClientTypeModel[]>();
  state = input.required<StateModel>();

  translate = inject(TranslateService);
  competitors = inject(CompetitorsService);

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
    toObservable(this.typologies)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.family.set(this.filterByType(data, 'family'));
        this.couple.set(this.filterByType(data, 'couple'));
        this.solo.set(this.filterByType(data, 'solo'));
        this.business.set(this.filterByType(data, 'business'));
      });
  }

  getClientypeVoteCompetitors(clientType: string) {
    const yourTypes = this.competitors.you.typologies().data;
    const competitorTypes = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor._id !== this.id())
      .map((competitor) => competitor.clientTypes)
      .flat();

    const typeVotes = [...yourTypes, ...competitorTypes]
      .filter((type) => type.clientType.toLocaleLowerCase() === clientType)
      .map((type) => type.totalRating)
      .filter((rating) => rating !== 0);

    return typeVotes.reduce((acc, curr) => acc + curr, 0) / typeVotes.length;
  }

  // getCategoryVoteCompetitors(category: string) {
  //   const yourCategories = this.competitors.you.categories().data;
  //   const competitorCategories = this.competitors.others
  //     .competitors()
  //     .filter((competitor) => !competitor.isExluded)
  //     .filter((competitor) => competitor._id !== this.id())
  //     .map((competitor) => competitor.categories)
  //     .flat();

  //   const categoryVotes = [...yourCategories, ...competitorCategories]
  //     .filter((cat) => cat.category === category)
  //     .map((category) => category.totalRating)
  //     .filter((rating) => rating !== 0);

  //   return categoryVotes.reduce((acc, curr) => acc + curr, 0) / categoryVotes.length;
  // }

  private filterByType(data: ClientTypeModel[], clientType: string) {
    const family = data.find((type) => type.clientType.toLowerCase() === clientType) || {
      totalCount: 0,
      filteredCount: 0,
      totalRating: 0,
      filteredRating: 0,
    };

    const { totalCount, filteredCount, totalRating, filteredRating } = family;

    const growthRating = filteredRating;
    const growthCount = filteredCount;

    return {
      totalCount,
      filteredCount,
      totalRating,
      filteredRating,
      growthRating,
      growthCount,
    };
  }
}
