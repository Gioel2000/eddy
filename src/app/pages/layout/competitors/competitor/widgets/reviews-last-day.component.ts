import { Component, computed, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { ReviewModel, StateModel } from '../../../../../store/competitors/interfaces/competitors';
import { MissingTranslationPipe } from '../../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'reviews-last-day',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, NumberPipe, MissingTranslationPipe],
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

    <div class="flex flex-col py-6">
      @switch (state()) { @case ('loaded') {
      <div class="lg:col-span-6 lg:mt-0">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-8">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'RECENT_REVIEWS' | translate }}
          </dt>
        </div>

        <div class="flow-root">
          <div class="divide-y divide-zinc-200 dark:divide-zinc-800">
            @for (review of recentReviews().slice(start(), end()); track $index) {
            <div class="py-6">
              <div class="flex flex-row items-center justify-between">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded-full bg-accent dark:bg-accentDark flex items-center justify-center text-base text-white/90"
                  >
                    {{ review.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-2">
                    <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ review.name }}</h4>
                    <div class="mt-1 flex items-center">
                      <div class="flex items-center">
                        <svg
                          [ngClass]="{
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': review.rating >= 1,
                            'text-zinc-200 dark:text-zinc-700': review.rating < 1
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': review.rating >= 2,
                            'text-zinc-200 dark:text-zinc-700': review.rating < 2
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': review.rating >= 3,
                            'text-zinc-200 dark:text-zinc-700': review.rating < 3
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': review.rating >= 4,
                            'text-zinc-200 dark:text-zinc-700': review.rating < 4
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
                            'text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]': review.rating >= 5,
                            'text-zinc-200 dark:text-zinc-700': review.rating < 5
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
                      <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">{{
                        review.rating | numb : translate.currentLang
                      }}</span>
                    </div>
                    <p class="sr-only">5 out of 5 stars</p>
                  </div>
                </div>
                <div class="flex flex-row items-center pl-2 py-1 z-100">
                  @if (review.channel.source === 'tripadvisor') {
                  <div
                    class="rounded-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 text-white bg-gradient-to-b from-black/20 via-zinc-300 to-zinc-300 dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/5 dark:shadow-black/40"
                  >
                    <div
                      class="flex flex-row items-center justify-center gap-x-2 bg-zinc-50 dark:bg-[#1A1A1A] p-3 py-2.5 rounded-[9998px] cursor-pointer"
                    >
                      <span
                        [inlineSVG]="'channels/tripadvisor.svg'"
                        class="svg-icon svg-icon-2 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                      ></span>
                      <span class="block text-sm font-bold mr-0.5 leading-6 text-emerald-600 dark:text-emerald-500">{{
                        'TRIPADVISOR' | translate
                      }}</span>
                    </div>
                  </div>
                  } @if (review.channel.source === 'google') {
                  <div
                    class="rounded-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 text-white bg-gradient-to-b from-black/20 via-zinc-300 to-zinc-300 dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/5 dark:shadow-black/40"
                  >
                    <div
                      class="flex flex-row items-center justify-center gap-x-2 bg-zinc-50 dark:bg-[#1A1A1A] p-3 py-2.5 rounded-[9998px] cursor-pointer"
                    >
                      <span
                        [inlineSVG]="'channels/google.svg'"
                        class="svg-icon svg-icon-4 stroke-[1.8] text-zinc-100"
                      ></span>
                      <span class="block text-sm font-bold mr-0.5 leading-6 text-zinc-800 dark:text-zinc-200">{{
                        'GOOGLE' | translate
                      }}</span>
                    </div>
                  </div>
                  } @if (review.channel.source === 'thefork') {
                  <div
                    class="rounded-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 text-white bg-gradient-to-b from-black/20 via-zinc-300 to-zinc-300 dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/5 dark:shadow-black/40"
                  >
                    <div
                      class="flex flex-row items-center justify-center gap-x-2 bg-zinc-50 dark:bg-[#1A1A1A] p-3 py-2.5 rounded-[9998px] cursor-pointer"
                    >
                      <span
                        [inlineSVG]="'channels/TheFork.svg'"
                        class="svg-icon svg-icon-4 stroke-[1.8] text-[#005f54] dark:text-[#00ab97]"
                      ></span>
                      <span class="block text-sm font-bold mr-0.5 leading-6 text-[#005f54] dark:text-[#00ab97]">{{
                        'THE_FORK' | translate
                      }}</span>
                    </div>
                  </div>
                  }
                </div>
              </div>

              <div class="mt-4 space-y-6 text-base font-semibold text-zinc-800 dark:text-zinc-200">
                <p>
                  {{ review.title }}
                </p>
              </div>
              <div class="mt-4 space-y-6 text-sm text-zinc-400 dark:text-zinc-600">
                <p>
                  {{ review.text }}
                </p>
              </div>

              <div class="mt-8 grid grid-cols-2 gap-2">
                @if (review.clientsType) { @if (review.clientsType[0] | lowercase; as clientType) {
                <div class="flex flex-col gap-y-3">
                  <div class="flex flex-row items-center justify-center w-fit gap-x-2">
                    <span
                      [inlineSVG]="
                        clientType === 'business'
                          ? 'suitcase-6.svg'
                          : clientType === 'couple'
                          ? 'users-3.svg'
                          : clientType === 'family'
                          ? 'crowd.svg'
                          : clientType === 'solo'
                          ? 'user.svg'
                          : 'users.svg'
                      "
                      class="svg-icon svg-icon-6 ml-0.5 stroke-2 text-zinc-900 dark:text-zinc-100"
                    ></span>
                    <span class="block text-sm font-bold mr-0.5 leading-6 text-zinc-900 dark:text-zinc-100">{{
                      clientType | uppercase | translate
                    }}</span>
                  </div>
                </div>
                }} @if (review.country; as country) {
                <div class="flex flex-col gap-y-2">
                  <span class="text-sm text-zinc-400 dark:text-zinc-600">
                    <div class="flex flex-row items-center justify-center w-fit gap-x-2">
                      <img
                        class="w-5 h-4 ml-0.5 rounded object-cover shadow"
                        alt=""
                        [src]="'./assets/flags/' + replaceAll(review.country.toLowerCase(), ' ', '-') + '.svg'"
                      />
                      <span class="block text-sm font-bold mr-0.5 leading-6 text-zinc-900 dark:text-zinc-100">{{
                        review.country
                      }}</span>
                    </div>
                  </span>
                </div>
                }
              </div>
            </div>
            }

            <div class="flex flex-col items-center justify-center w-full">
              <div class="flex flex-row items-center justify-end w-full pt-4 max-w-3xl">
                <div class="flex flex-row items-center gap-x-2">
                  <button
                    type="button"
                    class="flex flex-row items-center rounded-lg px-2.5 py-2 mt-4 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
                    [disabled]="start() === 0"
                    (click)="showLess()"
                  >
                    <span
                      [inlineSVG]="'arrow-left.svg'"
                      class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
                    ></span>
                  </button>
                  <button
                    type="button"
                    class="flex flex-row items-center rounded-lg px-2.5 py-2 mt-4 text-zinc-400 dark:text-zinc-600 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-semibold ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition ease-in-out duration-200"
                    [disabled]="stopKeepGoing()"
                    (click)="showMore()"
                  >
                    <span
                      [inlineSVG]="'arrow-right.svg'"
                      class="relative group-hover:top-0 svg-icon svg-icon-5 stroke-[1.6]"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
export class ReviewsLastDayComponent {
  recentReviews = input.required<ReviewModel[]>();
  state = input.required<StateModel>();

  translate = inject(TranslateService);

  totalReviews = computed(() => this.recentReviews().length);
  averageRating = computed(
    () => this.recentReviews().reduce((acc, review) => acc + review.rating, 0) / this.totalReviews()
  );
  stopKeepGoing = computed(() => this.end() >= this.recentReviews().length);
  tripadvisor = computed(() => {
    const reviews = this.recentReviews().filter((review) => review.channel.source === 'tripadvisor');

    return {
      totalReviews: reviews.length,
      averageRating: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
    };
  });

  reviesPerPage = 3;
  start = signal(0);
  end = signal(3);

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  next() {
    this.start.set(this.start() + this.reviesPerPage);
    this.end.set(this.end() + this.reviesPerPage);
  }

  prev() {
    this.start.set(this.start() - this.reviesPerPage);
    this.end.set(this.end() - this.reviesPerPage);
  }

  showLess() {
    this.start.set(this.start() - this.reviesPerPage);
    this.end.set(this.end() - this.reviesPerPage);
  }

  showMore() {
    this.start.set(this.start() + this.reviesPerPage);
    this.end.set(this.end() + this.reviesPerPage);
  }
}
