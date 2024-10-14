import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../../utils/pipes/growth.pipe';
import { SentimentTO } from '../../../../../store/dashboard/interfaces/dashboard';
import { CompetitorsService } from '../../competitors.service';
import { SubstringPipe } from '../../../../../utils/pipes/substring.pipe';
import { MissingTranslationPipe } from '../../../../../utils/pipes/missingTranslation.pipe';
import { TooltipComponent } from '../../../../../ui/tooltip/tooltip.component';

@Component({
  selector: 'categories-graph',
  imports: [
    InlineSVGModule,
    CommonModule,
    LoaderComponent,
    TranslateModule,
    NumberPipe,
    GrowthPipe,
    SubstringPipe,
    MissingTranslationPipe,
    TooltipComponent,
  ],
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

    <ng-template #better let-data>
      <tooltip
        [position]="data.index % 2 === 0 ? 'top-left' : 'top-right'"
        [class]="data.index % 2 === 0 ? '-ml-2' : '-mr-2'"
        label="{{ 'BETTER_THEN_YOUR_COMPETITOR' | translate }}"
      >
        <div class="flex flex-row items-center w-full text-green-500">
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
        </div>
      </tooltip>
    </ng-template>

    <ng-template #worse let-data>
      <tooltip
        [position]="data.index % 2 === 0 ? 'top-left' : 'top-right'"
        [class]="data.index % 2 === 0 ? '-ml-2' : '-mr-2'"
        label="{{ 'WORSE_THEN_YOUR_COMPETITOR' | translate }}"
      >
        <div class="flex flex-row items-center w-full text-red-500">
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
        </div>
      </tooltip>
    </ng-template>

    <ng-template #loaded>
      <div #container class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-200">
            {{ 'CATEGORIES' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              @for (category of categoriesOrdered(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <div class="flex flex-row items-start justify-between w-full -mb-2">
                      <p class="truncate text-sm font-bold text-zinc-300 w-full h-8">
                        {{ 'REVIEWS_CATEGORIES.' + (category.category | uppercase) + '.DESC' | translate }}
                      </p>
                      <div class="relative -right-2 -top-1 p-1">
                        @if (getCategoryVoteCompetitors(category.category); as competitorRating) {
                        @if(category.totalRating; as yourRating) {
                        <ng-container
                          [ngTemplateOutlet]="
                            competitorRating !== 0 &&
                            yourRating !== 0 &&
                            +competitorRating.toFixed(1) !== +yourRating.toFixed(1) &&
                            yourRating > competitorRating
                              ? better
                              : worse
                          "
                          [ngTemplateOutletContext]="{
                            $implicit: { index: $index }
                          }"
                        ></ng-container>
                        } }
                      </div>
                    </div>

                    <div class="flex flex-row items-center gap-2">
                      <div class="flex flex-row items-end">
                        <span class="text-2xl font-semibold text-zinc-100">
                          {{ category.totalRating | numb : translate.currentLang : 2 }}
                        </span>
                        <span class="relative -top-0.5 text-sm font-semibold text-zinc-700"> /5 </span>
                      </div>
                      <div>
                        @if (category.filteredRating > 0) {
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          class="h-4 w-4 text-green-500"
                        >
                          <g fill="currentColor">
                            <path
                              d="m6,11.75c-.414,0-.75-.336-.75-.75V1.25c0-.414.336-.75.75-.75s.75.336.75.75v9.75c0,.414-.336.75-.75.75Z"
                              stroke-width="0"
                            ></path>
                            <path
                              d="m9.25,5c-.192,0-.384-.073-.53-.22l-2.72-2.72-2.72,2.72c-.293.293-.768.293-1.061,0s-.293-.768,0-1.061L5.47.47c.293-.293.768-.293,1.061,0l3.25,3.25c.293.293.293.768,0,1.061-.146.146-.338.22-.53.22Z"
                              stroke-width="0"
                            ></path>
                          </g>
                        </svg>
                        } @if (category.filteredRating < 0) {
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          class="h-4 w-4 text-red-500"
                        >
                          <g fill="currentColor">
                            <path
                              d="m6,11.5c-.414,0-.75-.336-.75-.75V1c0-.414.336-.75.75-.75s.75.336.75.75v9.75c0,.414-.336.75-.75.75Z"
                              stroke-width="0"
                            ></path>
                            <path
                              d="m6,11.75c-.192,0-.384-.073-.53-.22l-3.25-3.25c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l2.72,2.72,2.72-2.72c.293-.293.768-.293,1.061,0s.293.768,0,1.061l-3.25,3.25c-.146.146-.338.22-.53.22Z"
                              stroke-width="0"
                            ></path>
                          </g>
                        </svg>
                        }
                      </div>
                    </div>

                    <div class="flex flex-row items-center justify-between mt-1">
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
                          class="bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - category.totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              } @for (word of words(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] shadow-black/5 ring-1 ring-inset ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-start justify-between w-full -mb-2">
                      <p class="truncate text-sm font-bold text-zinc-300 w-full h-8">
                        {{ 'REVIEWS_CATEGORIES.' + (word.category | uppercase) + '.DESC' | translate }}
                      </p>
                      <div class="p-1">
                        @if (getSentimentVoteCompetitors(word.category); as competitorRating) { @if(word.rating; as
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
                          [ngTemplateOutletContext]="{
                            $implicit: { index: $index + (categoriesOrdered().length % 2 !== 0 ? 1 : 0) }
                          }"
                        ></ng-container>
                        } }
                      </div>
                    </div>

                    <div class="flex flex-row items-end">
                      <span class="text-2xl font-semibold text-zinc-100">
                        {{ word.rating | numb : translate.currentLang : 2 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-700"> /5 </span>
                    </div>

                    <div class="flex flex-row items-center justify-between mt-1">
                      <div class="flex flex-row relative whitespace-nowrap">
                        <svg
                          class="text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          class="text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-[#1a1a1a]/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - word.rating) * 20"
                        ></div>
                      </div>
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

    <div class="flex flex-col border-b border-zinc-800 py-6 h-[36rem] overflow-y-auto">
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
  translate = inject(TranslateService);
  dashboard = inject(DashboardStore);
  competitors = inject(CompetitorsService);
  categories = computed(() => this.dashboard.categories());
  sentiment = computed(() => this.dashboard.sentiment());

  state = computed(() => {
    const categories = this.dashboard.categories().state;
    const sentiment = this.dashboard.sentiment().state;

    if (categories === 'loading' || sentiment === 'loading') return 'loading';
    if (categories === 'error' || sentiment === 'error') return 'error';
    if (categories === 'loaded' || sentiment === 'loaded') return 'loaded';
    if (categories === 'empty' && sentiment === 'empty') return 'empty';

    return 'loading';
  });

  categoriesOrdered = computed(() => {
    const categories = this.categories().data;
    return categories.sort((a, b) => a.category.localeCompare(b.category));
  });

  maxCountWord = computed(() => {
    const words = this.sentiment().data.map((a, b) => a.bad + a.good + a.neutral);
    const max = Math.max.apply(null, words);

    return max;
  });

  words = computed(() => {
    const sentiment = this.sentiment().data;
    return (sentiment || []).map((word) => ({
      ...word,
      rating: this.calculateSentimentRating(word),
    }));
  });

  getCategoryVoteCompetitors(category: string) {
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const categoryVotes = competitors
      .map((competitor) => competitor.categories?.find((cat) => cat.category === category)?.totalRating || 0)
      .filter((rating) => rating !== 0);

    return categoryVotes.reduce((acc, curr) => acc + curr, 0) / categoryVotes.length;
  }

  getSentimentVoteCompetitors(category: string) {
    const competitors = this.competitors.others
      .competitors()
      .filter((competitor) => !competitor.isExluded)
      .filter((competitor) => competitor.channels?.length > 0);
    const state = this.competitors.others.state();

    if (state !== 'loaded') return 0;

    const categoryVotes = competitors
      .map((competitor) => competitor.sentiment)
      .flat()
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
