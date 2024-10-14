import { Component, Signal, computed, effect, inject, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, mergeMap, toArray } from 'rxjs';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { CompetitorsService } from '../../competitors.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MissingTranslationPipe } from '../../../../../utils/pipes/missingTranslation.pipe';
import { TooltipComponent } from '../../../../../ui/tooltip/tooltip.component';

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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="h-4 w-4">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="h-4 w-4">
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

    <div #container class="flex flex-col border-b border-zinc-800 px-px py-6 h-[30rem] overflow-y-auto">
      @switch (store().state) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-200">
            {{ 'CHANNELS' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-1 gap-4">
              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] bg-[#1A1A1A] shadow-black/5 ring-1  ring-zinc-800 px-6 py-5 shadow-sm"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !google().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/google.svg'"
                      class="svg-icon svg-icon-1 text-zinc-200 stroke-[1.7]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between w-full -mb-2">
                      <p class="text-sm font-bold text-zinc-200 w-full h-8">{{ 'GOOGLE' | translate }}</p>
                      @if (getCompetitorRating('google'); as competitorRating) { @if (google().totalRating; as
                      yourRating) {
                      <ng-container
                        [ngTemplateOutlet]="
                          competitorRating !== 0 &&
                          yourRating !== 0 &&
                          +competitorRating.toFixed(1) !== +yourRating.toFixed(1) &&
                          yourRating > competitorRating
                            ? better
                            : worse
                        "
                      ></ng-container>
                      } }
                    </div>
                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-100">
                        <span>{{ google().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)] h-4 w-4"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-600 lowercase"
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
              </div>
              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] bg-[#1A1A1A] shadow-black/5 ring-1  ring-zinc-800 px-6 py-5 shadow-sm"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !tripadvisor().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/tripadvisor.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-emerald-500"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between w-full -mb-2">
                      <p class="text-sm font-bold text-zinc-200 w-full h-8">{{ 'TRIPADVISOR' | translate }}</p>
                      @if (getCompetitorRating('tripadvisor'); as competitorRating) { @if (tripadvisor().totalRating; as
                      yourRating) {
                      <ng-container
                        [ngTemplateOutlet]="
                          competitorRating !== 0 &&
                          yourRating !== 0 &&
                          +competitorRating.toFixed(1) !== +yourRating.toFixed(1) &&
                          yourRating > competitorRating
                            ? better
                            : worse
                        "
                      ></ng-container>
                      } }
                    </div>
                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-100">
                        <span>{{ tripadvisor().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)] h-4 w-4"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-600 lowercase"
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
              </div>
              <div
                class="relative flex items-center min-h-[112px] space-x-3 rounded-[10px] bg-[#1A1A1A] shadow-black/5 ring-1  ring-zinc-800 px-6 py-5 shadow-sm"
                [ngClass]="{
                  'cursor-not-allowed opacity-50': !thefork().totalCount
                }"
              >
                <div class="flex-shrink-0">
                  <div class="flex flex-row items-center justify-center h-10 w-10 rounded-full">
                    <span
                      [inlineSVG]="'channels/TheFork.svg'"
                      class="svg-icon svg-icon-1 stroke-[1.8] text-[#00ab97]"
                    ></span>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-center justify-between w-full -mb-2">
                      <p class="text-sm font-bold text-zinc-200 h-8">{{ 'THE_FORK' | translate }}</p>
                      @if (getCompetitorRating('thefork'); as competitorRating) { @if (thefork().totalRating; as
                      yourRating) {
                      <ng-container
                        [ngTemplateOutlet]="
                          competitorRating !== 0 &&
                          yourRating !== 0 &&
                          +competitorRating.toFixed(1) !== +yourRating.toFixed(1) &&
                          yourRating > competitorRating
                            ? better
                            : worse
                        "
                      ></ng-container>
                      } }
                    </div>

                    <div class="flex items-center xl:col-span-1 gap-x-1 mb-1">
                      <p class="font-bold tracking-tight text-xl tabular-nums text-zinc-100">
                        <span>{{ thefork().totalRating | numb : translate.currentLang : 1 }}</span>
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)] h-4 w-4"
                      >
                        <g fill="currentColor">
                          <path
                            d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                            fill="currentColor"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div
                      class="flex flex-row items-center w-full text-sm font-light tabular-nums text-zinc-600 lowercase"
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
  store = inject(DashboardStore).channels;
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
        };
        this.google.set(empty);
        this.thefork.set(empty);
        this.tripadvisor.set(empty);

        const google = data.find((channel) => channel.channel === 'google');
        const thefork = data.find((channel) => channel.channel === 'thefork');
        const tripadvisor = data.find((channel) => channel.channel === 'tripadvisor');

        google && this.google.set(google);
        thefork && this.thefork.set(thefork);
        tripadvisor && this.tripadvisor.set(tripadvisor);
      });
  }

  getCompetitorRating(channelSelected: string) {
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const channels = competitors
      .map((competitor) => competitor.channelsRatings)
      .flat()
      .filter((rating) => rating.channel === channelSelected)
      .filter((rating) => rating.totalRating > 0);

    const channelAverageRating = channels.reduce((acc, channel) => acc + channel.totalRating, 0) / channels.length;

    return channelAverageRating;
  }

  getCompetitorCount(channelSelected: string) {
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const channels = competitors
      .map((competitor) => competitor.channelsRatings)
      .flat()
      .filter((rating) => rating.channel === channelSelected)
      .filter((rating) => rating.totalCount > 0);

    const channelAverageRating = channels.reduce((acc, channel) => acc + channel.totalCount, 0) / channels.length;

    return channelAverageRating;
  }
}
