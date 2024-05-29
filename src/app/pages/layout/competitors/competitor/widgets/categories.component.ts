import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, input } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { CategoryTO, SentimentTO, StateModel } from '../../../../../store/competitors/interfaces/competitors';
import { CompetitorsService } from '../../competitors.service';

@Component({
  selector: 'categories-graph',
  imports: [InlineSVGModule, CommonModule, LoaderComponent, TranslateModule, NumberPipe, GrowthPipe],
  standalone: true,
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #loaded>
      <div #container class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'CATEGORIES' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              @for (category of categoriesOrdered(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 cursor-pointer shadow-sm shadow-black/5"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="flex flex-col gap-y-2">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm w-full font-semibold text-zinc-800 dark:text-zinc-200">
                        {{ 'REVIEWS_CATEGORIES.' + (category.category | uppercase) + '.DESC' | translate }}
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
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - category.totalRating) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {{ category.totalRating | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if (getCategoryVoteCompetitors(category.category); as competitorVote) {
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
                          class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - competitorVote) * 20"
                        ></div>
                      </div>
                      <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {{ competitorVote | numb : translate.currentLang : 1 }}
                      </span>
                    </div>

                    @if((category.totalRating - competitorVote); as diff) {
                    <div
                      class="flex flex-row items-center justify-between text-xs font-bold mt-2"
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
              } @for (word of words(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 cursor-pointer shadow-sm shadow-black/5"
              >
                <div class="flex flex-col gap-y-2 w-full">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {{ 'REVIEWS_CATEGORIES.' + (word.category | uppercase) + '.DESC' | translate }}
                      </p>
                    </div>

                    <div>
                      <div class="flex flex-row items-center justify-between mt-1">
                        <div class="flex flex-row relative whitespace-nowrap">
                          <svg
                            class="fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                          >
                            <g>
                              <path
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>
                          <svg
                            class="fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                          >
                            <g>
                              <path
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>
                          <svg
                            class="fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                          >
                            <g>
                              <path
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>
                          <svg
                            class="fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                          >
                            <g>
                              <path
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>
                          <svg
                            class="fill-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                          >
                            <g>
                              <path
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>

                          <div
                            class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                            [style.width.%]="(5 - word.rating) * 20"
                          ></div>
                        </div>
                        <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {{ word.rating | numb : translate.currentLang : 1 }}
                        </span>
                      </div>

                      @if (getSentimentVoteCompetitors(word.category); as competitorVote) {
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
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
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
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
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
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
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
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
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
                                d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                              ></path>
                            </g>
                          </svg>

                          <div
                            class="bg-white/50 dark:bg-[#141414]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                            [style.width.%]="(5 - competitorVote) * 20"
                          ></div>
                        </div>
                        <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {{ competitorVote | numb : translate.currentLang : 1 }}
                        </span>
                      </div>

                      @if((word.rating - competitorVote); as diff) {
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
                </div>
              </a>
              }
            </div>
          </dl>
        </div>
      </div>
    </ng-template>

    <div class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 py-6 h-[34rem] overflow-y-auto">
      @switch (state()) { @case ('loaded') {
      <ng-container [ngTemplateOutlet]="loaded"></ng-container>
      } @case ('error') {
      <ng-container [ngTemplateOutlet]="error"></ng-container>
      } @case ('empty') {
      <ng-container [ngTemplateOutlet]="loaded"></ng-container>
      } @case ('loading') {
      <ng-container [ngTemplateOutlet]="loading"></ng-container>
      } }
    </div>
  `,
})
export class CategoriesComponent {
  id = input.required<string>();
  categories = input.required<CategoryTO[]>();
  sentiment = input.required<SentimentTO[]>();
  state = input.required<StateModel>();
  translate = inject(TranslateService);
  competitors = inject(CompetitorsService);

  words = computed(() => {
    const sentiment = this.sentiment();
    return (sentiment || []).map((word) => ({
      ...word,
      rating: this.calculateSentimentRating(word),
    }));
  });

  categoriesOrdered = computed(() => {
    const categories = this.categories();
    return categories.sort((a, b) => a.category.localeCompare(b.category));
  });

  getCategoryVoteCompetitors(category: string) {
    const yourCategories = this.competitors.you.categories().data;
    const competitorCategories = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor._id !== this.id())
      .map((competitor) => competitor.categories)
      .flat();

    const categoryVotes = [...yourCategories, ...competitorCategories]
      .filter((cat) => cat.category === category)
      .map((category) => category.totalRating)
      .filter((rating) => rating !== 0);

    return categoryVotes.reduce((acc, curr) => acc + curr, 0) / categoryVotes.length;
  }

  getSentimentVoteCompetitors(category: string) {
    const yourSentiment = this.competitors.you.sentiment().data;
    const competitorSentiment = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor._id !== this.id())
      .map((competitor) => competitor.sentiment)
      .flat();

    const categoryVotes = [...yourSentiment, ...competitorSentiment]
      .filter((word) => word?.category === category)
      .map((word) => this.calculateSentimentRating(word))
      .filter((rating) => rating !== 0);

    return categoryVotes.reduce((acc, curr) => acc + curr, 0) / categoryVotes.length;
  }

  private calculateSentimentRating(word: SentimentTO) {
    const { bad, good } = word;
    const total = bad + good;

    if (total === 0) return 0;

    const rating = (good * 5) / total;

    return rating;
  }
}
