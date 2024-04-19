import { Component, computed, inject } from '@angular/core';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { ReviewsStore } from '../../../../store/reviews/reviews.service';

@Component({
  selector: 'sentiment-graph',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, NumberPipe],
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

    <div #container class="flex flex-col pt-8 pb-20">
      @switch (sentimentState()) { @case ('loaded') {
      <div class="lg:col-span-4">
        <div class="flex flex-col items-baseline justify-between gap-x-4 gap-y-2">
          <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
            {{ 'SENTIMENT' | translate }}
          </dt>
          <div class="flex flex-row items-center gap-x-3">
            <div class="flex flex-row items-end gap-x-3">
              <div class="flex flex-row items-center gap-x-3 w-full">
                <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-900 dark:text-zinc-100">
                  {{ rating() | numb : translate.currentLang : 1 }}
                </dd>
              </div>
              <div class="flex flex-col items-start gap-y-1">
                <div class="flex flex-row items-center mr-4">
                  <div class="flex items-center">
                    <svg
                      [ngClass]="{
                        'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': rating() >= 1,
                        'text-zinc-200 dark:text-zinc-700': rating() < 1
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
                        'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': rating() >= 2,
                        'text-zinc-200 dark:text-zinc-700': rating() < 2
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
                        'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': rating() >= 3,
                        'text-zinc-200 dark:text-zinc-700': rating() < 3
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
                        'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': rating() >= 4,
                        'text-zinc-200 dark:text-zinc-700': rating() < 4
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
                        'text-red-500 drop-shadow-[0_0px_5px_rgba(239,68,68,0.4)]': rating() >= 5,
                        'text-zinc-200 dark:text-zinc-700': rating() < 5
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
                  <p class="sr-only">4 out of 5 stars</p>
                </div>
                <p class="text-sm min-w-[200px] font-medium tabular-nums text-zinc-400 dark:text-zinc-600">
                  {{ sentiment().length | numb : translate.currentLang : 2 }}
                  {{ 'WORDS' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <dl class="space-y-3">
            @for (word of words().slice(0, 20); track $index) {
            <div class="flex items-center text-sm">
              <dt class="flex flex-1 items-center">
                <p class="w-20 truncate font-medium text-zinc-600 dark:text-zinc-400">
                  {{ word.word }}
                </p>
                <div aria-hidden="true" class="ml-1 flex flex-1 items-center text-yellow-400">
                  <div class="relative ml-3 flex-1 mr-0.5">
                    <div class="flex flex-row items-center gap-x-1">
                      @if (word.bad > 0) {
                      <div
                        [style.width.%]="(word.bad * 100) / maxCountWord()"
                        class="h-3 inset-y-0 rounded bg-red-400"
                      ></div>
                      } @if (word.neutral > 0) {
                      <div
                        [style.width.%]="(word.neutral * 100) / maxCountWord()"
                        class="h-3 inset-y-0 rounded bg-yellow-400"
                      ></div>
                      } @if (word.good > 0) {
                      <div
                        [style.width.%]="(word.good * 100) / maxCountWord()"
                        class="h-3 inset-y-0 rounded bg-green-400"
                      ></div>
                      }
                    </div>
                  </div>
                </div>
              </dt>
            </div>
            }
          </dl>
        </div>
        <div class="flex flex-row justify-between pt-10">
          <div class="flex flex-col gap-2">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              {{ 'NEGATIVE' | translate }}
            </p>
            <div class="flex flex-row items-center gap-x-2">
              <span [inlineSVG]="'face-sad-2.svg'" class="svg-icon-3 text-red-500 stroke-[1.7]"></span>
              <span class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                {{ negativePercentage() | numb : translate.currentLang : 1 }}%
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              {{ 'NEUTRAL' | translate }}
            </p>
            <div class="flex flex-row items-center gap-x-2">
              <span [inlineSVG]="'face-neutral.svg'" class="svg-icon-3 text-yellow-500 stroke-[1.7]"></span>
              <span class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                {{ neutralPercentage() | numb : translate.currentLang : 1 }}%
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              {{ 'POSITIVE' | translate }}
            </p>
            <div class="flex flex-row items-center gap-x-2">
              <span [inlineSVG]="'face-smile-2.svg'" class="svg-icon-3 text-green-500 stroke-[1.7]"></span>
              <span class="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                {{ positivePercentage() | numb : translate.currentLang : 1 }}%
              </span>
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
export class SentimentComponent {
  sentiment = inject(ReviewsStore).sentiment;
  sentimentState = inject(ReviewsStore).sentimentState;
  translate = inject(TranslateService);

  rating = computed(() => {
    const badCount = this.sentiment()
      .map((item) => item.bad)
      .reduce((a, b) => a + b, 0);
    const goodCount = this.sentiment()
      .map((item) => item.good)
      .reduce((a, b) => a + b, 0);
    const total = badCount + goodCount;
    const rating = (goodCount * 5) / total;

    return rating;
  });

  words = computed(() => this.sentiment().sort((a, b) => b.bad + b.good + b.neutral - (a.bad + a.good + a.neutral)));

  maxCountWord = computed(() => {
    const words = this.sentiment().map((a, b) => a.bad + a.good + a.neutral);
    const max = Math.max.apply(null, words);

    return max;
  });

  positivePercentage = computed(() => {
    const goods = this.sentiment()
      .map((item) => item.good)
      .reduce((a, b) => a + b, 0);

    const bads = this.sentiment()
      .map((item) => item.bad)
      .reduce((a, b) => a + b, 0);

    const neutral = this.sentiment()
      .map((item) => item.neutral)
      .reduce((a, b) => a + b, 0);

    const total = goods + bads + neutral;

    const percentage = (goods * 100) / total;

    return percentage;
  });

  negativePercentage = computed(() => {
    const goods = this.sentiment()
      .map((item) => item.good)
      .reduce((a, b) => a + b, 0);

    const bads = this.sentiment()
      .map((item) => item.bad)
      .reduce((a, b) => a + b, 0);

    const neutral = this.sentiment()
      .map((item) => item.neutral)
      .reduce((a, b) => a + b, 0);

    const total = goods + bads + neutral;

    const percentage = (bads * 100) / total;

    return percentage;
  });

  neutralPercentage = computed(() => {
    const goods = this.sentiment()
      .map((item) => item.good)
      .reduce((a, b) => a + b, 0);

    const bads = this.sentiment()
      .map((item) => item.bad)
      .reduce((a, b) => a + b, 0);

    const neutral = this.sentiment()
      .map((item) => item.neutral)
      .reduce((a, b) => a + b, 0);

    const total = goods + bads + neutral;

    const percentage = (neutral * 100) / total;

    return percentage;
  });
}
