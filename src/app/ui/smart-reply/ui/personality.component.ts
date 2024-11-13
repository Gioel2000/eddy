import { Component, EventEmitter, Output, WritableSignal, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';

@Component({
  selector: 'personality-dropdown',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ClickOutsideDirective, TranslateModule, ReactiveFormsModule],
  template: ` <div
    class="sm:min-w-36 w-full border-none md:border-l border-zinc-200 dark:border-zinc-800"
    (clickOutside)="close()"
  >
    <div class="relative">
      <label
        class="absolute flex flex-row items-center -top-2 left-2 gap-1 bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >{{ 'PERSONALITY' | translate }}
        <span class="svg-icon svg-icon-9 stroke-[1.8]">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
            <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
              <circle
                cx="9"
                cy="9"
                r="7.25"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></circle>
              <path
                d="M11.25,11.758c-.472,.746-1.304,1.242-2.25,1.242s-1.778-.496-2.25-1.242"
                fill="none"
                stroke="inherit"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-color="color-2"
              ></path>
              <circle cx="6" cy="9" r="1" data-color="color-2" data-stroke="none" stroke="none"></circle>
              <circle cx="12" cy="9" r="1" data-color="color-2" data-stroke="none" stroke="none"></circle>
            </g>
          </svg>
        </span>
      </label>
      <button
        type="button"
        class="block w-full ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 font-medium focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        (click)="toggle()"
      >
        <div class="flex flex-row items-center justify-between">
          <span class="truncate max-w-full font-medium text-zinc-700 dark:text-zinc-300">
            {{ 'PERSONALITY' | translate }}
          </span>
          <span
            [inlineSVG]="'chevron-down.svg'"
            class="svg-icon svg-icon-9 text-zinc-600 dark:text-zinc-400 stroke-2"
          ></span>
        </div>
      </button>
      <div [ngClass]="{ hidden: !isOpen() }">
        <div
          class="absolute left-0 z-10 mt-2 w-full origin-top-left rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-300 dark:ring-zinc-800 focus:outline-none transition ease-out duration-200 animate-blurToClear200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          [ngClass]="{
            'opacity-100 scale-100': isVisible(),
            'opacity-0 scale-90': !isVisible()
          }"
        >
          <div role="none">
            <fieldset>
              <div class="space-y-3">
                <ul role="list">
                  <li
                    class="flex flex-row items-center py-1.5 px-2 rounded-t-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.KINDNESS' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <span class="svg-icon svg-icon-9 stroke-[1.8] mr-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                        <title>heart hand</title>
                        <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                          <path
                            d="M10.955,5.681c.183-.518,.295-1.075,.295-1.675,.006-1.514-1.217-2.747-2.733-2.756-.912,.012-1.76,.471-2.267,1.229-.507-.757-1.355-1.217-2.267-1.229-1.516,.009-2.739,1.242-2.733,2.756,0,2.462,1.805,4.243,3.247,5.275"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            data-color="color-2"
                          ></path>
                          <path
                            d="M16.75,14.725c0-2.059-.236-3.639-1-4.223-.875-.669-3.152-.838-5.295-.232l-1.33-2.827c-.293-.626-1.037-.896-1.663-.603h0c-.625,.292-.896,1.036-.604,1.661l2.561,5.456-2.724-.501c-.587-.108-1.167,.224-1.371,.785h0c-.232,.637,.098,1.34,.736,1.569l2.616,.941"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </span>
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.PROFESSIONALISM' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.EMPATHY' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.DIRECT' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.FRIENDLY' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.HUMOROUS' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center rounded-b-lg py-1.5 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'PERSONALITIES.SERIOUS' | translate
                    }}</span>
                  </li>
                </ul>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class PersonalityDropdownComponent {
  isOpen = signal(false);
  isVisible = signal(false);

  personalitySwitcher = input.required<FormControl<string | null>>();

  open() {
    this.isOpen.set(true);
    setTimeout(() => this.isVisible.set(true), 0);
  }

  close() {
    this.isVisible.set(false);
    setTimeout(() => this.isOpen.set(false), 50);
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }
}
