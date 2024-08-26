import { Component, computed, effect, inject } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { GrowthPipe } from '../../../../utils/pipes/growth.pipe';
import { CategoryTO, SentimentTO } from '../../../../store/dashboard/interfaces/dashboard';
import { ReviewsService } from '../../reviews/reviews.service';
import { Router } from '@angular/router';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'categories-graph',
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
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div
        id="error-view"
        class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]"
      >
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div #container class="flex flex-col py-3">
      @switch (state()) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'CATEGORIES' | translate }}
          </dt>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            <div class="grid grid-cols-2 gap-4 2xl:grid-cols-4">
              @for (category of categories(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] px-6 py-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkCategory(category.category)"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-1 text-base font-bold text-zinc-900 dark:text-zinc-100 max-w-22">
                        {{ 'REVIEWS_CATEGORIES.' + (category.category | uppercase) + '.DESC' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ category.totalRating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                      <!-- @if (category.filteredRating) {
                      <span
                        class="text-sm px-1 font-semibold tabular-nums relative -top-0.5"
                        [ngClass]="{
                          'text-red-500': category.filteredRating < 0,
                          'text-green-500': category.filteredRating > 0,
                          'text-zinc-500': category.filteredRating === 0
                        }"
                        >{{ category.filteredRating | growth : translate.currentLang : 3 }}</span
                      >
                      } -->
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
                          [style.width.%]="(5 - category.totalRating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="category.icon"
                ></span>
              </a>
              } @for (word of words(); track $index) {
              <a
                class="group relative flex items-center space-x-3 rounded-[10px] bg-white dark:bg-dark shadow-black/5 ring-1 ring-inset ring-zinc-200 dark:ring-[#1e1e1e] px-6 py-5 shadow-sm cursor-pointer hover:ring-[3px] hover:ring-accent hover:shadow-md dark:hover:ring-accentDark hover:shadow-accent/10 dark:hover:shadow-accentDark/10 transition ease-in-out duration-200"
                (click)="checkCategory(word.category)"
              >
                <div class="min-w-0 flex-1 z-10">
                  <div class="focus:outline-none">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <div class="flex flex-row items-center justify-between">
                      <p class="line-clamp-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {{ 'REVIEWS_CATEGORIES.' + (word.category | uppercase) + '.DESC' | translate }}
                      </p>
                    </div>

                    <div class="flex flex-row items-end py-1">
                      <span class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {{ word.rating | numb : translate.currentLang : 1 }}
                      </span>
                      <span class="relative -top-0.5 text-sm font-semibold text-zinc-300 dark:text-zinc-700"> /5 </span>
                    </div>

                    <div class="flex items-center xl:col-span-1">
                      <div class="flex flex-row relative whitespace-nowrap mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          class="text-red-500"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          class="text-red-500"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          class="text-red-500"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          class="text-red-500"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          class="text-red-500"
                        >
                          <title>heart</title>
                          <g fill="currentColor">
                            <path
                              d="M12.164,2c-1.195,.015-2.324,.49-3.164,1.306-.84-.815-1.972-1.291-3.178-1.306-2.53,.015-4.582,2.084-4.572,4.609,0,5.253,5.306,8.429,6.932,9.278,.256,.133,.537,.2,.818,.2s.562-.067,.817-.2c1.626-.848,6.933-4.024,6.933-9.275,.009-2.528-2.042-4.597-4.586-4.612Z"
                            ></path>
                          </g>
                        </svg>

                        <div
                          class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
                          [style.width.%]="(5 - word.rating) * 20"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  class="absolute top-5 right-5 stroke-[1.5] text-zinc-100 group-hover:text-zinc-200 dark:text-[#1A1A1A] dark:group-hover:text-[#2F2F2F] svg-illustration-7 transition ease-in-out duration-200"
                  [inlineSVG]="word.icon"
                ></span>
              </a>
              }
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
export class CategoriesComponent {
  translate = inject(TranslateService);
  dashboard = inject(DashboardStore);
  reviews = inject(ReviewsService);
  router = inject(Router);

  icons = [
    {
      category: 'restaurant_service',
      icon: 'food-delivery-time.svg',
    },
    {
      category: 'restaurant_atmosphere',
      icon: 'portal-sparkle.svg',
    },
    {
      category: 'restaurant_food',
      icon: 'pizza-slice-2.svg',
    },
    {
      category: 'restaurant_value',
      icon: 'currency-dollar.svg',
    },
  ];

  categories = computed(() =>
    this.dashboard
      .categories()
      .data.map((category) => ({
        ...category,
        icon: this.icons.find((icon) => icon.category === category.category)?.icon || '',
      }))
      .sort((a, b) => b.category.localeCompare(a.category))
  );
  sentiment = computed(() => this.dashboard.sentiment().data);

  state = computed(() => {
    const categories = this.dashboard.categories().state;
    const sentiment = this.dashboard.sentiment().state;

    if (categories === 'loading' || sentiment === 'loading') return 'loading';
    if (categories === 'error' || sentiment === 'error') return 'error';
    if (categories === 'loaded' || sentiment === 'loaded') return 'loaded';
    if (categories === 'empty' && sentiment === 'empty') return 'empty';

    return 'loading';
  });

  maxCountWord = computed(() => {
    const words = this.sentiment().map((a, b) => a.bad + a.good + a.neutral);
    const max = Math.max.apply(null, words);

    return max;
  });

  words = computed(() => {
    const sentiment = this.sentiment();
    return sentiment
      .map((word) => ({
        ...word,
        rating: this.calculateSentimentRating(word),
        icon: this.icons.find((icon) => icon.category === word.category)?.icon || '',
      }))
      .sort((a, b) => b.category.localeCompare(a.category));
  });

  private calculateSentimentRating(word: SentimentTO) {
    const { bad, good } = word;
    const total = bad + good;

    if (total === 0) return 0;

    const rating = (good * 5) / total;

    return rating;
  }

  checkCategory(category: string) {
    this.reviews.filter.set({
      startdate: undefined,
      enddate: undefined,
      channels: ['thefork', 'tripadvisor', 'google'],
      clients: [],
      offset: 0,
      rows: 5,
      sentimentWords: [],
      sentimentCategories: [category],
      rating: undefined,
    });

    this.router.navigate(['/reviews']);
  }

  // private growthRating(rating: CategoryTO) {
  //   const actualRating = rating.totalRating;
  //   const actualReview = rating.totalCount;
  //   const totalStars = actualRating * actualReview;

  //   const newRating = rating.totalRating + rating.filteredRating;
  //   const newReview = rating.filteredCount;
  //   const newStars = newRating * newReview;

  //   const newTotalStars = totalStars + newStars;
  //   const newTotalReview = actualReview + newReview;

  //   const weightedAverage = newTotalStars / newTotalReview;

  //   const growth = weightedAverage - actualRating;

  //   return growth;
  // }
}
