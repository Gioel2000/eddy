import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, filter, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MISSING_TRANSLATION } from '../../utils/constants/missingTranslation';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SERVICES } from './data/reviews.data';
import { ReplacePipe } from '../../utils/pipes/replace.pipe';
import { MissingTranslationPipe } from '../../utils/pipes/missingTranslation.pipe';
import { ReviewTO } from '../../store/reviews/interfaces/reviews';
import { TranslateDropdownComponent } from './components/types/translate.component';
import { LoaderComponent } from '../loader/loader.component';
import { ReviewsStore } from '../../store/reviews/reviews.service';
import LanguageDetect from 'languagedetect';
import { BodyReviewSentimentComponent } from './components/review-body-sentiment.component';
import { StructureStore } from '../../store/structures/structure.service';

@UntilDestroy()
@Component({
  selector: 'body-review',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ReplacePipe,
    MissingTranslationPipe,
    ReactiveFormsModule,
    TranslateDropdownComponent,
    LoaderComponent,
    BodyReviewSentimentComponent,
  ],
  template: `
    <div
      class="z-100 mb-12 sm:ml-16 pb-8"
      [ngClass]="{ 'border-b border-zinc-200 dark:border-zinc-800': showBorder() }"
    >
      <ng-container *ngIf="reviewContent$ | async as reviewContent">
        <div class="grid grid-cols-6 my-8">
          <div class="flex flex-row items-center col-span-full sm:col-span-4 mb-5 sm:mb-0">
            @if ((reviewContent.title || '').trim().length !== 0) {
            <h3 class="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2 mr-2">
              {{ reviewContent.title }}
            </h3>
            } @else {
            <div *ngIf="reviewContent?.text as text">
              <span class="text-sm max-w-none text-zinc-500" [innerHTML]="text"></span>
            </div>
            }
            <!-- <span
              *ngIf="review().isTitleTranslated"
              [inlineSVG]="'./assets/icons/bold/Translate language.svg'"
              class="svg-icon svg-icon svg-icon-1 text-zinc-700 dark:text-zinc-300 cursor-pointer mb-1"
            ></span> -->
          </div>

          <div class="col-span-full xl:col-span-2">
            <div class="flex flex-row items-center justify-start sm:justify-end mb-3">
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
                  [style.width.%]="(5 - review().rating) * 20"
                ></div>
              </div>

              <!-- <div *ngFor="let avr of calculateStars(review().rating)">
                @if (avr === 'full') {
                <svg
                  class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
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
                } @if (avr === 'empty') {
                <svg
                  class="text-zinc-200 dark:text-zinc-700"
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
                } @if (avr === 'half') {
                <svg
                  class="text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                >
                  <title>star-half</title>
                  <g fill="currentColor">
                    <path
                      d="M16.963,6.786c-.088-.271-.322-.469-.605-.51l-4.619-.671L9.673,1.418c-.254-.512-1.092-.512-1.346,0l-2.065,4.186-4.619,.671c-.283,.041-.518,.239-.605,.51-.089,.271-.015,.57,.189,.769l3.343,3.258-.789,4.601c-.048,.282,.067,.566,.299,.734,.229,.167,.536,.189,.789,.057l4.132-2.173,4.132,2.173c.109,.058,.229,.086,.349,.086,.155,0,.311-.048,.44-.143,.231-.168,.347-.452,.299-.734l-.789-4.601,3.343-3.258c.204-.199,.278-.498,.189-.769Zm-4.861,3.228c-.177,.172-.258,.42-.216,.664l.599,3.492-3.136-1.649c-.108-.057-.229-.086-.349-.086V3.445l1.567,3.177c.109,.221,.32,.375,.565,.41l3.506,.509-2.537,2.473Z"
                    ></path>
                  </g>
                </svg>
                }
              </div> -->
              <dd class="ml-2 w-5 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {{ (review().rating * amountToMultiply).toFixed(1) | replace : '.0' : '' }}
              </dd>
            </div>

            <ng-container *ngIf="sentimentVote$ | async as vote">
              <div class="flex flex-row items-center justify-start sm:justify-end mb-3">
                <div class="flex flex-row relative whitespace-nowrap">
                  <svg
                    class="fill-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                    width="16"
                    height="16"
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
                    width="16"
                    height="16"
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
                    width="16"
                    height="16"
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
                    width="16"
                    height="16"
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
                    [style.width.%]="(5 - (scale === 5 ? vote / 2 : vote)) * 20"
                  ></div>
                </div>
                <dd class="ml-2 w-5 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {{ (scale === 5 ? vote / 2 : vote).toFixed(1) | replace : '.0' : '' }}
                </dd>
              </div>
            </ng-container>
          </div>
        </div>
        @if ((reviewContent.title || '').trim().length !== 0) {
        <div *ngIf="reviewContent?.text as text">
          <span class="text-sm mt-4 max-w-none text-zinc-500" [innerHTML]="text"></span>
        </div>
        }

        <div class="mt-5">
          <ng-container *ngIf="categories$ | async as categories">
            <ng-container *ngIf="categories && categories.length">
              <body-review-sentiment [categories]="categories"></body-review-sentiment>
            </ng-container>
          </ng-container>
        </div>

        <div class="mt-2 mb-3">
          <div class="grid grid-cols-2 gap-4 w-full pt-3 sm:pt-6">
            @for (category of review().categories; track $index) {
            <div class="col-span-2 mb-6 sm:col-span-1 sm:mb-0">
              <div class="flex flex-row items-center justify-between mt-1 pr-2 py-1 z-100">
                <p class="line-clamp-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {{ 'REVIEWS_CATEGORIES.' + (category.category | uppercase) + '.DESC' | translate }}
                </p>

                <div class="flex flex-row items-center justify-start sm:justify-end">
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
                      [style.width.%]="(5 - category.rating) * 20"
                    ></div>
                  </div>
                  <dd class="ml-2 w-5 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {{ (category.rating * amountToMultiply).toFixed(1) | replace : '.0' : '' }}
                  </dd>
                </div>

                <!-- <div class="flex flex-row items-center justify-start sm:justify-end">
                  <div *ngFor="let avr of calculateStars(category.rating)">
                    @if (avr === 'full') {
                    <svg
                      class="text-yellow-400 drop-shadow-[0_0px_5px_rgba(234,179,8,0.4)]"
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
                    } @if (avr === 'empty') {
                    <svg
                      class="text-zinc-200 dark:text-zinc-700"
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
                    } @if (avr === 'half') {
                    <svg
                      class="text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 18 18"
                    >
                      <title>star-half</title>
                      <g fill="currentColor">
                        <path
                          d="M16.963,6.786c-.088-.271-.322-.469-.605-.51l-4.619-.671L9.673,1.418c-.254-.512-1.092-.512-1.346,0l-2.065,4.186-4.619,.671c-.283,.041-.518,.239-.605,.51-.089,.271-.015,.57,.189,.769l3.343,3.258-.789,4.601c-.048,.282,.067,.566,.299,.734,.229,.167,.536,.189,.789,.057l4.132-2.173,4.132,2.173c.109,.058,.229,.086,.349,.086,.155,0,.311-.048,.44-.143,.231-.168,.347-.452,.299-.734l-.789-4.601,3.343-3.258c.204-.199,.278-.498,.189-.769Zm-4.861,3.228c-.177,.172-.258,.42-.216,.664l.599,3.492-3.136-1.649c-.108-.057-.229-.086-.349-.086V3.445l1.567,3.177c.109,.221,.32,.375,.565,.41l3.506,.509-2.537,2.473Z"
                        ></path>
                      </g>
                    </svg>
                    }
                  </div>
                  <dd class="ml-2 w-5 text-right text-sm tabular-nums text-zinc-900 dark:text-zinc-100">
                    {{ (category.rating * amountToMultiply).toFixed(1) | replace : '.0' : '' }}/{{ scale }}
                  </dd>
                </div> -->
              </div>
            </div>
            }
          </div>
        </div>

        <div class="mt-2 mb-3">
          <div class="grid grid-cols-6 w-full pt-3 sm:pt-6">
            <div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
              <div class="flex flex-row items-center mt-1 pr-2 py-1 z-100">
                @if (review().channel.source === 'tripadvisor') {
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
                } @if (review().channel.source === 'google') {
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
                } @if (review().channel.source === 'thefork') {
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

            <div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
              <div class="flex flex-row items-center mt-4 pr-2 py-1 z-100">
                @if (review().clientsType; as clientsTypes) { @if (clientsTypes[0] | lowercase; as clientType) {
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
                } }
              </div>
            </div>

            <div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
              <div class="flex flex-row items-center mt-4 pr-2 py-1 z-100">
                @if (review().country; as country) {
                <div class="flex flex-col gap-y-2">
                  <span class="text-sm text-zinc-400 dark:text-zinc-600">
                    <div class="flex flex-row items-center justify-center w-fit gap-x-2">
                      <img
                        class="w-5 h-4 ml-0.5 rounded object-cover shadow"
                        alt=""
                        [src]="'./assets/flags/' + replaceAll(country.toLowerCase(), ' ', '-') + '.svg'"
                      />
                      <span class="block text-sm font-bold mr-0.5 leading-6 text-zinc-900 dark:text-zinc-100">{{
                        country
                      }}</span>
                    </div>
                  </span>
                </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 mb-3">
          <div class="grid grid-cols-6 w-full py-3 sm:py-6">
            <div class="col-span-full mb-6 sm:col-span-2 sm:mb-0">
              <ng-container *ngIf="(canBeTranslated$ | async) === true">
                <div class="flex flex-row items-center gap-x-4">
                  <translate-dropdown (selected)="langSwitcher.patchValue($event)"></translate-dropdown>
                  @if (isLoading$ | async) {
                  <loader></loader>
                  }
                </div>
              </ng-container>
            </div>
          </div>
        </div>
        <div>
          <div *ngIf="(alreadyReplied$ | async) === false">
            <label for="comment" class="block text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-200">{{
              'COMMENT' | translate
            }}</label>
            <textarea
              [formControl]="commentControl"
              rows="3"
              name="comment"
              id="comment"
              placeholder="{{ 'COMMENT_PLACEHOLDER' | translate }}"
              class="mt-2 mb-4 block w-full rounded-[10px] border-0 py-3 px-4 bg-transparent text-zinc-800 dark:text-zinc-200 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-800 placeholder:text-zinc-400 placeholder:dark:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent focus:dark:ring-accentDark text-sm leading-6 focus:outline-none transition ease-in-out duration-300"
            ></textarea>
          </div>
          <div class="flex flex-row items-center justify-between w-full mt-2 mb-3">
            <div *ngIf="(alreadyReplied$ | async) === false">
              <button
                class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] h-full w-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-[#1A1A1A] text-white bg-gradient-to-b from-black/55 via-[#1A1A1A] to-[#1A1A1A] dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/25 disabled:opacity-30"
                [disabled]="commentControl.invalid"
                (click)="onCopyAndReply()"
              >
                <div
                  class="flex flex-row items-center justify-center gap-x-2 bg-[#1A1A1A] h-full w-full px-3 py-2 rounded-[9px] cursor-pointer"
                >
                  <span class="text-sm font-semibold">{{ 'COPY_SEND' | translate }}</span>
                  <span
                    class="svg-icon svg-icon-6 stroke-2 text-zinc-100 dark:text-zinc-100 relative -bottom-px"
                    [inlineSVG]="'paper-plane-4.svg'"
                  ></span>
                </div>
              </button>
            </div>
            <div *ngIf="(alreadyReplied$ | async) === true">
              <button
                class="flex flex-row items-center justify-center text-sm font-semibold col-span-1 rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer ring-1 ring-zinc-300 dark:ring-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm disabled:opacity-30 transition ease-in-out duration-200"
                (click)="showReview()"
              >
                <span [inlineSVG]="'share-right-4.svg'" class="svg-icon svg-icon-5 stroke-[1.7] mr-1.5"></span>
                <span>{{ 'OPEN' | translate | uppercase }}</span>
              </button>
            </div>
            <div class="relative flex items-start">
              <div class="flex h-5 items-center">
                <input
                  type="checkbox"
                  class="h-5 w-5 mt-2 rounded-md cursor-pointer text-accent dark:text-accentDark bg-zinc-200 dark:bg-zinc-800 border-none dark:text-accentDark-100 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                  [checked]="alreadyReplied$ | async"
                  (change)="alreadyReplied()"
                />
              </div>
              <div class="ml-2 text-sm leading-6">
                <label for="comments" class="font-medium text-zinc-900 dark:text-zinc-100">{{
                  'MARK_AS_REPLIED' | translate
                }}</label>
                <p id="comments-description" class="hidden sm:block text-zinc-500 font-normal text-xs">
                  {{ 'MARK_AS_REPLIED_DESCRIPTION' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="(alreadyReplied$ | async) === false">
          <div class="flex flex-row items-center justify-between mt-14 gap-x-3">
            <div class="flex flex-row items-center gap-x-3">
              <div class="group relative max-w-7xl">
                <div
                  class="absolute -inset-1 bg-rainbow rounded-[10px] blur group-hover:opacity-40 group-hover:dark:opacity-30 opacity-0 transition ease-in-out duration-200"
                ></div>
                <div class="relative rounded-[10px] leading-none space-x-6">
                  <button
                    class="rounded-[10px] p-0.5 bg-rainbow-opacity-50 cursor-pointer leading-6 disabled:cursor-not-allowed shadow-md shadow-black/10"
                    [disabled]="isResponseLoading() || isResponseError()"
                    (click)="askAIToReply()"
                  >
                    <div
                      class="flex flex-row items-center gap-x-2 px-3 py-2 opacity-100 bg-rainbow cursor-pointer rounded-[8px]"
                    >
                      <span class="text-sm font-semibold text-white dark:text-white">{{
                        'HAVE_THE_AI_RESPOND' | translate
                      }}</span>
                      <span
                        [inlineSVG]="'wand-sparkle.svg'"
                        class="svg-icon svg-icon-6 stroke-2 text-white dark:text-white"
                      ></span>
                    </div>
                  </button>
                </div>
              </div>

              @if (isResponseLoading()) {
              <div class="flex flex-row items-center justify-center">
                <div class="flex flex-row items-center justify-center w-full">
                  <loader></loader>
                </div>
              </div>
              } @if (isResponseError()) {
              <div class="flex flex-row items-center justify-center">
                <div class="flex flex-row items-center justify-center w-full">
                  <span
                    [inlineSVG]="'triangle-warning.svg'"
                    class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"
                  ></span>
                </div>
              </div>
              } @if (isResponseSuccess()) {
              <div class="flex flex-row items-center justify-center">
                <div class="flex flex-row items-center justify-center w-full">
                  <span [inlineSVG]="'check.svg'" class="svg-icon svg-icon-1 text-green-500 stroke-[1.7]"></span>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyReviewComponent {
  scale: number = 5;
  amountToMultiply: number = 1;
  readonly langSwitcher = new FormControl('');
  readonly commentControl = new FormControl('');
  readonly canBeTranslated$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly alreadyReplied$ = new BehaviorSubject<boolean>(false);
  readonly sentimentVote$ = new Subject<number>();
  readonly content$ = new BehaviorSubject<string>('');
  readonly categories$ = new BehaviorSubject<any[]>([]);
  readonly originalLangKey$ = new BehaviorSubject<string>('');
  readonly reviewContent$ = new BehaviorSubject<{
    title?: string;
    text?: string;
  }>({});

  review = input.required<ReviewTO>();
  showBorder = input.required<boolean>();
  store = inject(ReviewsStore);
  structure = inject(StructureStore);

  isResponseSuccess = signal(false);
  isResponseLoading = signal(false);
  isResponseError = signal(false);

  constructor(
    private readonly translateService: TranslateService // private readonly reviewsService: ReviewsService, // private readonly francisService: FrancisService
  ) {
    setTimeout(() => {
      const titleOriginal = this.review().title;
      const source = this.review().channel.source;
      const reviewLang = this.getLanguageFromReviewContent();
      const index = this.getIndexTranslation('en');
      const canBeTranslated = reviewLang === null ? false : reviewLang !== 'it';

      const { text } = this.review();
      const { title: titleTranslated, translated: isTitleTranslated } = this.translate(titleOriginal);
      const { scale, amountToMultiply } = SERVICES.find((service: any) => service._id === source) || {
        scale: 5,
        amountToMultiply: 1,
      };
      const title = isTitleTranslated ? titleTranslated : this.review().title;
      const titleFormatted = title.trim().length > 0 ? title : this.review().title;

      this.scale = scale;
      this.amountToMultiply = amountToMultiply;
      //   this.review.set({
      //     ...this.review(),
      //     titleTranslated,
      //     isTitleTranslated,
      //   });

      this.reviewContent$.next({
        text,
        title: titleTranslated,
      });
      this.canBeTranslated$.next(canBeTranslated);
      this.alreadyReplied$.next(this.review().hasReplied);

      reviewLang && this.originalLangKey$.next('LANGS.' + reviewLang);

      if (reviewLang === 'it') {
        const content = {
          ...this.review(),
          title: this.review().title,
        };

        this.reviewContent$.next({
          ...content,
          title: titleFormatted,
        });

        this.calculateSentiment(content, 'it');
      }

      if (reviewLang !== 'it' && index !== -1) {
        const translation = this.review().translations[index];
        translation &&
          this.reviewContent$.next({
            text: translation.text,
            title: titleFormatted,
          });

        this.calculateSentiment(translation, 'en');
      }

      const aiReply = this.review().aiReply;
      if (aiReply) {
        // this.commentControl.setValue(aiReply.reply);
      }
    });

    this.langSwitcher.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((value) => value !== null),
        map((value) => value as string),
        map((value) => (value === 'your_language' ? this.translateService.currentLang : value))
      )
      .subscribe((currentLang: string) => {
        const index = this.getIndexTranslation(currentLang);

        if (index !== -1) {
          const translation = this.review().translations![index];
          const translatedTitle = translation?.title || '';
          const titleFormatted = translatedTitle.trim().length > 0 ? translatedTitle : this.review().title;
          const text = translation?.text || '';

          this.reviewContent$.next({
            text: text,
            title: titleFormatted,
          });
          this.calculateSentiment(translation, currentLang);
        } else {
          this.isLoading$.next(true);
          this.store
            .translate(this.review()._id, currentLang)
            .pipe(untilDestroyed(this))
            .subscribe((translation) => {
              this.isLoading$.next(false);
              const translatedTitle = translation?.title || '';
              const titleFormatted = translatedTitle.trim().length > 0 ? translatedTitle : this.review().title;
              const text = translation?.text || '';

              this.reviewContent$.next({
                title: titleFormatted,
                text: text,
              });
              this.calculateSentiment(translation, currentLang);
              this.review().translations = [...(this.review().translations || []), translation];
            });
        }
      });

    this.langSwitcher.patchValue('your_language', { emitEvent: false });
  }

  calculateStars(rating: number) {
    const ratingFormatted = parseFloat(rating.toFixed(1)) * this.amountToMultiply;
    const stars: string[] = [];
    let index = ratingFormatted;
    Array.from({ length: this.scale }).map(() => {
      stars.push(index >= 1 ? 'full' : index >= 0.5 ? 'half' : 'empty');
      index--;
    });

    return stars;
  }

  calculateHearts(rating: number) {
    const ratingFormatted = parseFloat(rating.toFixed(1));

    const hearths: string[] = [];
    let index = ratingFormatted;
    Array.from({ length: this.scale }).map(() => {
      hearths.push(index >= 1 ? 'full' : index >= 0.5 ? 'half' : 'empty');
      index--;
    });

    return hearths;
  }

  translate(titleReview: string): { title: string; translated: boolean } {
    const translatedTitle =
      this.translateService.instant(
        `REVIEWS.REVIEWS_TRANSLATED.${this.replaceAll(titleReview.toUpperCase(), ' ', '_')}`
      ) || MISSING_TRANSLATION;

    const isTranslated = translatedTitle !== MISSING_TRANSLATION;

    return {
      title: isTranslated ? translatedTitle : titleReview,
      translated: isTranslated,
    };
  }

  onCopyAndReply() {
    const { value } = this.commentControl;

    if (!value) return;

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.showReview();
  }

  showReview() {
    const { replyLink } = this.review();

    if (replyLink) {
      const formatted = replyLink.includes('http') ? replyLink : `https://${replyLink}`;

      window.open(formatted, '_blank');
      return;
    }

    const channels = this.structure.selected().channels;
    const channel = channels.find((channel: any) => channel.source === this.review().channel.source);
    channel && window.open(channel.url, '_blank');
  }

  alreadyReplied() {
    this.store.setReviewReplied(this.review()._id, !this.alreadyReplied$.value).subscribe();

    this.alreadyReplied$.next(!this.alreadyReplied$.value);
  }

  askToFrancisToReplyInLang() {
    const reviewContent = this.review().text;
    const reviewTitle = this.review().title;
    const reviewScore = this.review().rating;
    const originallangreview = this.getLanguageFromReviewContent();
    const translation = originallangreview ? 'LANGS.' + originallangreview : 'english';
    const lang = this.translateService.instant(translation);
    const translatedQuestion = this.translateService.instant('FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW_IN_LANG', {
      lang,
    });
    const question = `${translatedQuestion}: \"${reviewTitle || ''}  ${reviewContent || ''}\"`;

    // this.francisService.askQuestion(question, question, reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT);
  }

  askToFrancisToReply() {
    const reviewContent = this.review().text;
    const reviewTitle = this.review().title;
    const reviewScore = this.review().rating;

    const translatedQuestion = this.translateService.instant('FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW');

    const question = `${translatedQuestion}: \"${reviewTitle || ''}  ${reviewContent || ''}\"`;

    // this.francisService.askQuestion(question, question, reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT);
  }

  askToFrancisToAnalyze() {
    const reviewContent = this.review().text;
    const reviewTitle = this.review().title;
    const reviewScore = this.review().rating;

    const translatedQuestion = this.translateService.instant('FRANCIS.REVIEWS.ANALYSIS_THIS_REVIEW');
    const question = `${translatedQuestion}: \"${reviewTitle || ''}  ${reviewContent || ''}\"`;

    // this.francisService.askQuestion(question, question, reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT);
  }

  private calculateSentiment(translation: any, currentLang: string) {
    const sentimentsByWords = [];
    const sentimentByCategory = [];

    const { sentiments } = this.review();

    for (const [, value] of Object.entries(sentiments) as any) {
      sentimentsByWords.push(
        ...(currentLang === 'en' ? value.words : value.wordsIt).map((word: any) => ({
          word,
          ...value,
        }))
      );

      sentimentByCategory.push(
        ...value.category.map((category: any) => ({
          singleCategory: category,
          ...value,
        }))
      );
    }

    this.underlineSetiment(translation, sentimentsByWords);
    this.showSentimentCategories(translation, sentimentByCategory);
  }

  private showSentimentCategories(translation: any, sentiments: any) {
    // .filter((sentiment: any) => sentiment.score !== 0)
    const categories = sentiments.map((sentiment: any) => {
      const translation = this.translateService.instant('REVIEWS_CATEGORIES.' + sentiment.singleCategory.toUpperCase());

      return {
        name: translation.DESC,
        score: sentiment.score,
        category: sentiment.singleCategory,
      };
    });

    const sentimentVotes = categories.map((category: any) => {
      const vote = category.score;
      if (vote >= 4) return 10;
      if (vote >= 3 && vote < 4) return 8;
      if (vote >= 2 && vote < 3) return 7;
      if (vote >= 1 && vote < 2) return 6;
      if (vote >= 0 && vote < 1) return 5;
      if (vote >= -1 && vote < 0) return 4;
      if (vote >= -2 && vote < -1) return 3;
      if (vote >= -3 && vote < -2) return 2;
      if (vote >= -4 && vote < -3) return 1;
      if (vote < -4) return 0;
      return 0;
    });

    const sentimentVoteAverage = +(
      (sentimentVotes.reduce((acc: any, curr: any) => acc + curr, 0) / sentimentVotes.length +
        this.review().rating * 2) /
      2
    ).toFixed(1);

    const categoriesGrouped = categories.reduce((acc: any, curr: any) => {
      const { name, score } = curr;
      const category = acc.find((category: any) => category.name === name);

      category ? (category.score = (category.score + score) / 2) : acc.push(curr);

      return acc;
    }, []);

    this.categories$.next(
      categoriesGrouped.map((category: any) => ({
        ...category,
        valutation: category.score < 0 ? 'negative' : category.score > 0 ? 'positive' : 'neutral',
      }))
    );

    this.sentimentVote$.next(sentimentVoteAverage);
  }

  private underlineSetiment(translation: any, sentiments: any) {
    // .filter((sentiment: any) => sentiment.score !== 0)
    const sentimentsWords = sentiments.map((sentiment: any) => ({
      word: sentiment.word,
      valutation: sentiment.score < 0 ? 'negative' : sentiment.score > 0 ? 'positive' : 'neutral',
      replaced: false,
    }));

    const replaceBySentiment = (attr: string) => {
      if (!attr) return '';

      let attrWithSentiment = '';
      let startIndex = 0;
      let text = attr.toLowerCase();

      sentimentsWords.forEach((sentimentWord: any) => {
        const { word, valutation, replaced } = sentimentWord;
        const wordIndex = text.indexOf(word.toLowerCase());

        if (wordIndex !== -1 && !replaced) {
          const endIndex = wordIndex + word.length;
          const beforeWord = text.substring(startIndex, wordIndex);
          const afterWord = text.substring(endIndex, text.length);
          const wordToReplace = text.substring(wordIndex, endIndex);

          attrWithSentiment += `${beforeWord}<span class="sentiment-${valutation}">${wordToReplace}</span>`;
          text = afterWord;
          startIndex = 0;
          sentimentWord.replaced = true;
        }
      });

      attrWithSentiment += text;

      return attrWithSentiment;
    };

    const text = translation.text || '';
    const title = translation.title || '';

    const textSentiment = replaceBySentiment(text);

    this.reviewContent$.next({
      title: title,
      text: textSentiment,
    });
  }

  private getIndexTranslation(lang: string) {
    const translations = this.review().translations;

    if (!translations) return -1;

    return translations.findIndex((translation: any) => translation.language === lang);
  }

  private getLanguageFromReviewContent() {
    try {
      const lngDetector = new LanguageDetect();
      const { title, text } = this.review();
      const reviewContent = `${title || ''} ${text || ''}`;
      const lang = lngDetector.detect(reviewContent)[0][0].toLowerCase();

      return reviewContent.trim().length > 0 ? lang : null;
    } catch {
      return null;
    }
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  askAIToReply() {
    this.isResponseLoading.set(true);
    this.store
      .askAIReply(this.review()._id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ reply }) => {
          this.isResponseLoading.set(false);
          this.isResponseError.set(false);
          this.isResponseSuccess.set(true);
          this.commentControl.setValue(reply);
          setTimeout(() => this.isResponseSuccess.set(false), 1500);
        },
        error: () => {
          this.isResponseLoading.set(false);
          this.isResponseError.set(true);
        },
      });
  }
}
