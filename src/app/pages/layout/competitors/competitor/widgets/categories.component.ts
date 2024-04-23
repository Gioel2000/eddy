import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
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

    <ng-template #loaded>
      <div class="lg:col-span-4">
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
                class="group relative flex items-center space-x-3 rounded-xl shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        {{ 'REVIEWS_CATEGORIES.' + (category.category | uppercase) + '.DESC' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end">
                      <span class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ category.totalRating | numb : translate.currentLang : 2 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      @if (category.filteredRating) {
                      <span
                        class="text-xs px-1 font-semibold tabular-nums relative -top-1"
                        [ngClass]="{
                          'text-red-500': category.filteredRating < 0,
                          'text-green-500': category.filteredRating > 0,
                          'text-zinc-500': category.filteredRating === 0
                        }"
                        >{{ category.filteredRating | growth : translate.currentLang : 2 }}</span
                      >
                      }
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex items-center pt-1">
                        <svg
                          [ngClass]="{
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': category.totalRating >= 1,
                            'text-zinc-300 dark:text-zinc-700': category.totalRating < 1
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': category.totalRating >= 2,
                            'text-zinc-300 dark:text-zinc-700': category.totalRating < 2
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': category.totalRating >= 3,
                            'text-zinc-300 dark:text-zinc-700': category.totalRating < 3
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': category.totalRating >= 4,
                            'text-zinc-300 dark:text-zinc-700': category.totalRating < 4
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': category.totalRating >= 5,
                            'text-zinc-300 dark:text-zinc-700': category.totalRating < 5
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
                    </div>

                    @if (getCategoryVoteCompetitors(category.category); as competitorVote) {
                    <span
                      class="text-[0.70rem] font-bold tabular-nums relative -top-0.5"
                      [ngClass]="{
                        'text-red-500': category.totalRating < competitorVote,
                        'text-green-500': category.totalRating > competitorVote,
                        'text-zinc-500': competitorVote === category.totalRating
                      }"
                      >{{ 'COMPETITION' | translate }}: {{ competitorVote | numb : translate.currentLang : 1 }}</span
                    >
                    }
                  </div>
                </div>
              </a>
              } @for (word of words(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-xl shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 px-6 py-5 shadow-sm cursor-pointer"
              >
                <div class="min-w-0 flex-1">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        {{ 'REVIEWS_CATEGORIES.' + (word.category | uppercase) + '.DESC' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end">
                      <span class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ word.rating | numb : translate.currentLang : 2 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex items-center pt-1">
                        <svg
                          [ngClass]="{
                            'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': word.rating >= 1,
                            'text-zinc-300 dark:text-zinc-700': word.rating < 1
                          }"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          [ngClass]="{
                            'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': word.rating >= 2,
                            'text-zinc-300 dark:text-zinc-700': word.rating < 2
                          }"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          [ngClass]="{
                            'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': word.rating >= 3,
                            'text-zinc-300 dark:text-zinc-700': word.rating < 3
                          }"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          [ngClass]="{
                            'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': word.rating >= 4,
                            'text-zinc-300 dark:text-zinc-700': word.rating < 4
                          }"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          [ngClass]="{
                            'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': word.rating >= 5,
                            'text-zinc-300 dark:text-zinc-700': word.rating < 5
                          }"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                      </div>
                    </div>

                    @if (getSentimentVoteCompetitors(word.category); as competitorVote) {
                    <span
                      class="text-[0.70rem] font-bold tabular-nums relative -top-0.5"
                      [ngClass]="{
                        'text-red-500': word.rating < competitorVote,
                        'text-green-500': word.rating > competitorVote,
                        'text-zinc-500': competitorVote === word.rating
                      }"
                      >{{ 'COMPETITION' | translate }}: {{ competitorVote | numb : translate.currentLang : 1 }}</span
                    >
                    }
                  </div>
                </div>
              </a>
              }
            </div>
          </dl>
        </div>
      </div>
    </ng-template>

    <div #container class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 py-6">
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
      .filter((competitor) => competitor._id !== this.id())
      .map((competitor) => competitor.categories)
      .flat();

    const categoryVotes = [...yourCategories, ...competitorCategories]
      .filter((cat) => cat.category === category)
      .map((category) => category.totalRating);

    return categoryVotes.reduce((acc, curr) => acc + curr, 0) / categoryVotes.length;
  }

  getSentimentVoteCompetitors(category: string) {
    const yourSentiment = this.competitors.you.sentiment().data;
    const competitorSentiment = this.competitors.others
      .competitors()
      .filter((competitor) => competitor._id !== this.id())
      .map((competitor) => competitor.sentiment)
      .flat();

    const categoryVotes = [...yourSentiment, ...competitorSentiment]
      .filter((word) => word.category === category)
      .map((word) => this.calculateSentimentRating(word));

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
