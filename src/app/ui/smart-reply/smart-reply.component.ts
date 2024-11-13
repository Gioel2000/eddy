import { Component, computed, effect, inject, signal } from '@angular/core';
import { SmartReplyDialogService } from './smart-reply.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import { FormControl } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { ReviewsStore } from '../../store/reviews/reviews.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AIReply } from '../../store/reviews/interfaces/reviews';
import { franc } from 'franc';
import { LANGUAGES } from '../../utils/constants/languages';
import { I18nStore } from '../../store/i18n/i18n.service';

@UntilDestroy()
@Component({
  selector: 'smart-reply-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, MomentPipe, LoaderComponent],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
        hidden: !dialog.isDialogOpen(),
      }"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- <div
        class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
      ></div> -->

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-end text-end">
          <div
            class="absolute bg-rainbow transform overflow-hidden rounded-t-2xl text-left transition-all pt-[3px] px-[3px] shadow-raimbow shadow-xl shadow-black/20"
            [ngClass]="{
              'opacity-100 translate-y-0': dialog.isDialogVisible(),
              'opacity-0 translate-y-4': !dialog.isDialogVisible(),
            }"
            [ngStyle]="{
              width: dialog.width() + 5 + 'px',
              left: dialog.left() + 'px',
            }"
            (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
          >
            <div
              class="relative bg-white dark:bg-zinc-900 pt-[3px] px-[3px] rounded-t-[13px] max-h-[42rem] sm:max-h-full overflow-y-auto overflow-x-hidden"
            >
              <div class="flex flex-col justify-between max-h-full min-h-[25rem] h-full py-4 px-5">
                <div class="flex flex-col">
                  <div class="absolute right-0 top-0 hidden pr-4 pt-4">
                    <button
                      type="button"
                      class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100 animate-blurToClear100"
                      (click)="dialog.closeDialog()"
                    >
                      <span class="svg-icon svg-icon-8 stroke-[1.6]">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                            <line
                              x1="14"
                              y1="4"
                              x2="4"
                              y2="14"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              data-color="color-2"
                            ></line>
                            <line
                              x1="4"
                              y1="4"
                              x2="14"
                              y2="14"
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></line>
                          </g>
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div class="flex items-start">
                    <div class="mt-0 text-left">
                      <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100" id="modal-title">
                        <div class="flex flex-row items-center gap-x-2">
                          <span class="text-base font-semibold leading-6 text-zinc-900 dark:text-white"
                            >Smart Reply AI</span
                          >
                          <span
                            [inlineSVG]="'wand-sparkle.svg'"
                            class="svg-icon svg-icon-6 stroke-2 text-zinc-900 dark:text-white"
                          ></span>
                        </div>
                      </h3>
                      <div class="mt-2">
                        <p
                          class="text-sm text-zinc-500"
                          [innerHTML]="'REPLY_TO_USER_SMART' | translate : { user: dialog.review()?.name }"
                        ></p>
                      </div>
                    </div>
                  </div>
                  <div class="pt-8 pb-5">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-zinc-200 dark:border-white/5"></div>
                      </div>
                      <div class="relative flex justify-start">
                        <span
                          class="bg-white dark:bg-zinc-900 pr-2 text-sm font-normal text-zinc-800 dark:text-zinc-200"
                          >{{ 'PERSONALITY' | translate }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-y-3 gap-x-2.5">
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('kindness')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'kindness',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'kindness',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>heart hands</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <path
                              d="M17.25,16c-.141-1.25-.906-2.375-2.503-2.753"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                            <path
                              d="M17.25,7.181l-.957-2.192c-.123-.282-.33-.519-.592-.68l-2.099-1.284c-.256-.157-.554-.233-.854-.219l-1.437,.069c-.399,.019-.773,.196-1.041,.492l-1.079,1.193c-.268,.37-.251,.875,.04,1.227h0c.356,.43,.995,.487,1.421,.127l.598-.557,1.234,.132c.26,.028,.501,.151,.664,.356,.437,.549,1.141,1.774,.392,3.351-.653,1.376-2.681,2.47-3.805,2.913-.581,.229-.873,.876-.669,1.467h0c.218,.632,.928,.975,1.54,.704,3.739-1.657,3.354-.24,5.646-1.782"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                            <path
                              d="M.75,16c.141-1.25,.906-2.375,2.503-2.753"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M.75,7.181l.957-2.192c.123-.282,.33-.519,.592-.68l2.099-1.284c.256-.157,.554-.233,.854-.219l1.437,.069c.399,.019,.773,.196,1.041,.492l1.079,1.193c.268,.37,.251,.875-.04,1.227h0c-.356,.43-.995,.487-1.421,.127l-.598-.557-1.234,.132c-.26,.028-.501,.151-.664,.356-.437,.549-1.141,1.774-.392,3.351,.653,1.376,2.681,2.47,3.805,2.913,.581,.229,.873,.876,.669,1.467h0c-.218,.632-.928,.975-1.54,.704-3.739-1.657-3.354-.24-5.646-1.782"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.KINDNESS' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('professionalism')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'professionalism',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'professionalism',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>necktie</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <path
                              d="M10.25,5.25l1.881,8.464c.074,.334-.027,.682-.269,.924l-2.155,2.155c-.391,.391-1.024,.391-1.414,0l-2.155-2.155c-.242-.242-.343-.59-.269-.924l1.881-8.464"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M11.736,2.65c.294-.515,.085-1.186-.464-1.411-.579-.238-1.351-.451-2.272-.451s-1.693,.213-2.272,.451c-.549,.225-.758,.896-.464,1.411,.495,.867,.99,1.733,1.486,2.6h2.5l1.486-2.6Z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.PROFESSIONALISM' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('empathy')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'empathy',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'empathy',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <title>heart-handshake</title>
                          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                            <path
                              d="M9,4.47c-.71-1.06-1.897-1.704-3.173-1.72-2.123,.013-3.834,1.739-3.826,3.859,0,4.826,4.959,7.794,6.529,8.613h0c.297,.155,.644,.155,.941,0,.921-.481,3.01-1.701,4.578-3.603"
                            ></path>
                            <path
                              d="M9,4.47l-2.833,3.822,.446,.399c.833,.746,2.116,.663,2.847-.183l1.269-1.468,3.321,4.58c1.104-1.339,1.951-3.016,1.951-5.01,.008-2.12-1.704-3.846-3.826-3.859-1.277,.016-2.464,.66-3.173,1.72Z"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.EMPATHY' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('direct')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'direct',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'direct',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>face speechless sweat</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <circle cx="6" cy="9.5" r="1" stroke="none" fill="currentColor"></circle>
                            <circle cx="12" cy="9.5" r="1" stroke="none" fill="currentColor"></circle>
                            <line
                              x1="7.75"
                              y1="12.25"
                              x2="10.25"
                              y2="12.25"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></line>
                            <line
                              x1="5"
                              y1="8.25"
                              x2="13"
                              y2="8.25"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></line>
                            <path
                              d="M11.3,2.129c-.724-.242-1.495-.379-2.3-.379C4.996,1.75,1.75,4.996,1.75,9s3.246,7.25,7.25,7.25,7.25-3.246,7.25-7.25c0-.283-.02-.561-.052-.835"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M15.353,5.75c1.047,0,1.897-.852,1.897-1.902,0-1.445-1.897-3.098-1.897-3.098,0,0-1.897,1.652-1.897,3.098,0,1.051,.849,1.902,1.897,1.902Z"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.DIRECT' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('friendly')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'friendly',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'friendly',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>face smile closed eyes</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <circle cx="9" cy="9" r="7.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                            <path
                              d="M11.25,11.758c-.472,.746-1.304,1.242-2.25,1.242s-1.778-.496-2.25-1.242"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                            <path
                              d="M4.75,9c0-.69,.56-1.25,1.25-1.25s1.25,.56,1.25,1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                            <path
                              d="M10.75,9c0-.69,.56-1.25,1.25-1.25s1.25,.56,1.25,1.25"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke="currentColor"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.FRIENDLY' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="selectedPersonality.set('humorous')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'humorous',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'humorous',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>face laughing</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <path
                              d="M11.897,10.757c-.154-.154-.366-.221-.583-.189h0c-1.532,.239-3.112,.238-4.638-.001-.214-.032-.421,.035-.572,.185-.154,.153-.227,.376-.193,.598,.23,1.511,1.558,2.651,3.089,2.651s2.86-1.141,3.089-2.654c.033-.216-.039-.436-.192-.589Z"
                              stroke="none"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M14.692,13.49c-1.328,1.681-3.384,2.76-5.692,2.76-2.308,0-4.365-1.079-5.692-2.76"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M16,7.107c-.832-3.086-3.651-5.357-7-5.357C5.651,1.75,2.832,4.021,2,7.107"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M5,8.25c0-.69,.56-1.25,1.25-1.25s1.25,.56,1.25,1.25"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M10.5,8.25c0-.69,.56-1.25,1.25-1.25s1.25,.56,1.25,1.25"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M.478,11.917c.611,.57,1.57,.535,2.141-.077,.52-.558,.606-1.62,.604-2.275,0-.319-.27-.57-.588-.549-.654,.043-1.708,.202-2.228,.76-.572,.613-.54,1.572,.071,2.142Z"
                              stroke="none"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M17.522,11.917c-.611,.57-1.57,.535-2.141-.077-.52-.558-.606-1.62-.604-2.275,0-.319,.27-.57,.588-.549,.654,.043,1.708,.202,2.228,.76,.572,.613,.54,1.572-.071,2.142Z"
                              stroke="none"
                              fill="currentColor"
                            ></path>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.HUMOROUS' | translate
                      }}</span>
                    </a>
                    <a
                      class="flex flex-row items-center rounded-lg py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      (click)="selectedPersonality.set('serious')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          selectedPersonality() === 'serious',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': selectedPersonality() !== 'serious',
                      }"
                    >
                      <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                          <title>face neutral</title>
                          <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                            <circle cx="9" cy="9" r="7.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                            <circle cx="6" cy="9" r="1" stroke="none" fill="currentColor"></circle>
                            <circle cx="12" cy="9" r="1" stroke="none" fill="currentColor"></circle>
                            <line
                              x1="7"
                              y1="12.25"
                              x2="11"
                              y2="12.25"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></line>
                          </g>
                        </svg>
                      </span>
                      <span class="text-sm font-medium truncate capitalize">{{
                        'PERSONALITIES.SERIOUS' | translate
                      }}</span>
                    </a>
                  </div>
                  <div class="pt-8 pb-5">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center" aria-hidden="true">
                        <div class="w-full border-t border-zinc-200 dark:border-white/5"></div>
                      </div>
                      <div class="relative flex justify-start">
                        <span
                          class="bg-white dark:bg-zinc-900 pr-2 text-sm font-normal text-zinc-800 dark:text-zinc-200"
                          >{{ 'RESPONSE_LANGUAGE' | translate }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-y-3 gap-x-2.5">
                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('en')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'en',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'en',
                      }"
                    >
                      <img
                        class="w-4 h-3.5 mr-1.5 rounded object-cover"
                        alt=""
                        [src]="'./assets/flags/united-kingdom.svg'"
                      />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.english' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('it')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'it',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'it',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/italy.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.italian' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('es')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'es',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'es',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/spain.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.spanish' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('fr')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'fr',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'fr',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/france.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.french' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('de')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'de',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'de',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/germany.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.german' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('pt')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'pt',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'pt',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/portugal.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.portuguese' | translate }}</span>
                    </a>

                    <a
                      class="flex flex-row items-center py-2 px-2.5 rounded-lg cursor-pointer"
                      (click)="langSwitcher.patchValue('ru')"
                      [ngClass]="{
                        'bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800':
                          langSwitcher.value === 'ru',
                        'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': langSwitcher.value !== 'ru',
                      }"
                    >
                      <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/russia.svg'" />
                      <span class="text-sm font-medium truncate capitalize">{{ 'LANGS.russian' | translate }}</span>
                    </a>
                  </div>
                  <div class="flex flex-row items-center gap-x-3 mt-12">
                    <div class="group relative max-w-7xl">
                      <div
                        class="absolute -inset-1 bg-rainbow rounded-[10px] blur group-hover:opacity-40 group-hover:dark:opacity-30 opacity-0 transition ease-in-out duration-200 animate-blurToClear200"
                      ></div>
                      <div class="relative rounded-[10px] leading-none space-x-6">
                        <button
                          class="rounded-[10px] p-0.5 bg-rainbow-opacity-50 disabled:opacity-30 cursor-pointer leading-6 disabled:cursor-not-allowed shadow-md shadow-black/10"
                          [disabled]="langSwitcher.value === '' || aiRepliesAreMoreThan10()"
                          (click)="generateResponse()"
                        >
                          <div
                            class="flex flex-row items-center gap-x-2 px-3 py-2 opacity-100 bg-rainbow cursor-pointer rounded-[8px]"
                          >
                            <span class="text-sm font-semibold text-white dark:text-white">
                              {{ 'GENERATE_REPLY' | translate }}
                            </span>
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
                  @if (aiRepliesAreMoreThan10()) {
                  <span class="text-red-500 text-sm font-medium mt-3 mb-1">{{ 'LIMIT_REACHED' | translate }}</span>
                  } @if (dialog.review()?.aiReply!.length > 0) {
                  <div class="pt-4 mt-5">
                    <div class="flex flex-row items-center justify-between">
                      <label
                        class="flex flex-row items-center gap-x-1 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300"
                      >
                        <span class="svg-icon svg-icon-7 stroke-2" [inlineSVG]="'clock-rotate-clockwise-2.svg'"></span>
                        {{ 'RESPONSE_HISTORY' | translate }}
                      </label>
                      <span class="isolate inline-flex">
                        <button
                          type="button"
                          class="relative inline-flex items-center rounded-full bg-white dark:bg-zinc-900 px-1 py-1 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-950 disabled:opacity-30 focus:z-10"
                          [disabled]="!hasPreviousPage()"
                          (click)="previousPage()"
                        >
                          <span class="sr-only">Previous</span>
                          <svg
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          class="relative -ml-px inline-flex items-center rounded-full bg-white dark:bg-zinc-900 px-1 py-1 text-zinc-400 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-950 disabled:opacity-30 focus:z-10"
                          [disabled]="!hasNextPage()"
                          (click)="nextPage()"
                        >
                          <span class="sr-only">Next</span>
                          <svg
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <div class="mx-auto max-w-7xl">
                      <div class="flow-root">
                        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table class="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
                              <thead>
                                <tr>
                                  <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-0"
                                  ></th>
                                  <th
                                    scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-0 min-w-6"
                                  ></th>
                                  <th
                                    scope="col"
                                    class="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                                  ></th>
                                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0"></th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700">
                                @for (reply of aiReplies().slice(start(), end()); track $index) {
                                <tr>
                                  <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-normal text-zinc-900 dark:text-zinc-100 sm:pl-0 max-w-xs truncate overflow-hidden"
                                  >
                                    {{ reply.content }}
                                  </td>
                                  <td class="whitespace-nowrap py-4 text-sm text-zinc-500 capitalize">
                                    <img
                                      class="w-4 h-3.5 mr-1.5 rounded object-cover"
                                      alt=""
                                      src="assets/flags/{{ reply.flag }}.svg"
                                    />
                                  </td>
                                  <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 capitalize">
                                    {{ reply.createdAt | moment : translate.currentLang : 'MMM DD, YYYY' }}
                                  </td>
                                  <td
                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                                  >
                                    <a
                                      class="text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 cursor-pointer"
                                      (click)="pasteFromHistory(reply)"
                                    >
                                      <span
                                        class="svg-icon svg-icon-6 stroke-2 relative -bottom-px"
                                        [inlineSVG]="'duplicate.svg'"
                                      ></span>
                                    </a>
                                  </td>
                                </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SmartReplyDialogComponent {
  dialog = inject(SmartReplyDialogService);
  translate = inject(TranslateService);
  store = inject(ReviewsStore);
  i18n = inject(I18nStore);

  langSwitcher = new FormControl<string>('en');
  selectedPersonality = signal('kindness');

  isResponseSuccess = signal(false);
  isResponseLoading = signal(false);
  isResponseError = signal(false);

  aiRepliesAreMoreThan10 = computed(() => (this.dialog.review()?.aiReply.length || 0) > 10);
  repliesPerPage = 3;
  start = signal(0);
  end = signal(this.repliesPerPage);
  hasPreviousPage = computed(() => this.start() > 0);
  hasNextPage = computed(() => this.end() < (this.dialog.review()?.aiReply.length || 0));

  aiReplies = computed(() => {
    const review = this.dialog.review();

    if (!review) return [];

    return review.aiReply.map((reply) => {
      const { reply: content } = reply;
      const language = this.detectLang(content);
      const flag = LANGUAGES.find((lang) => lang.locale === language)?.flag;
      return {
        ...reply,
        content,
        flag,
      };
    });
  });

  constructor() {
    window.addEventListener('scroll', this.close.bind(this));
    window.addEventListener('resize', this.close.bind(this));

    effect(() => {
      const review = this.dialog.review();
      if (!review) return;
      this.langSwitcher.patchValue(review.language);
    });
  }

  previousPage() {
    this.start.set(this.start() - this.repliesPerPage);
    this.end.set(this.end() - this.repliesPerPage);
  }

  nextPage() {
    this.start.set(this.start() + this.repliesPerPage);
    this.end.set(this.end() + this.repliesPerPage);
  }

  generateResponse() {
    const { _id: reviewId } = this.dialog.review() || {};
    const personality = this.selectedPersonality();
    const { value: lang } = this.langSwitcher;
    const i18n = this.i18n.selectedLang().locale;

    this.dialog.pasteResponse()('reply');

    if (
      !reviewId ||
      !personality ||
      !lang ||
      this.isResponseLoading() ||
      this.isResponseSuccess() ||
      this.isResponseError()
    )
      return;

    this.isResponseLoading.set(true);

    this.store
      .askAIReply(reviewId, personality, lang, i18n)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (aiReply: AIReply) => {
          this.isResponseLoading.set(false);
          this.isResponseError.set(false);
          this.isResponseSuccess.set(true);

          setTimeout(() => {
            this.close();
            this.dialog.pasteResponse()(aiReply);
            this.store.addAiReply$.next({
              reviewId,
              newAiReply: aiReply,
            });
            this.isResponseSuccess.set(false);
          }, 300);
        },
        error: () => {
          this.isResponseLoading.set(false);
          this.isResponseError.set(true);
        },
      });
  }

  pasteFromHistory(response: AIReply) {
    this.dialog.pasteResponse()(response);
    setTimeout(() => this.close(), 100);
  }

  private detectLang(content: string) {
    try {
      const formatter = (lang: string) => {
        switch (lang) {
          case 'sp':
            return 'es';
          case 'bu':
            return 'ru';
          case 'po':
            return 'pt';
          default:
            return lang;
        }
      };
      const langCode = franc(content);
      const lang = langCode === 'und' ? 'un' : langCode.substring(0, 2).toLowerCase();
      const langFormatted = formatter(lang);

      return content.trim().length > 0 ? langFormatted : null;
    } catch {
      return 'en';
    }
  }

  private close() {
    this.start.set(0);
    this.end.set(this.repliesPerPage);
    this.dialog.isDialogOpen() && this.dialog.closeDialog();
  }
}
