import { Component, EventEmitter, Output, WritableSignal, inject, input, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';

@Component({
  selector: 'translate-dropdown',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ClickOutsideDirective, TranslateModule, ReactiveFormsModule],
  template: ` <div
    class="sm:min-w-36 w-full border-none md:border-l border-zinc-200 dark:border-zinc-800"
    (clickOutside)="close()"
  >
    <div class="relative">
      <label
        class="absolute flex flex-row items-center -top-2 left-2 gap-1 bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >{{ 'RESPONSE_LANGUAGE' | translate }}
        <span class="svg-icon svg-icon-9 stroke-[1.8]">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
            <title>language</title>
            <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
              <line
                x1="2.25"
                y1="4.25"
                x2="10.25"
                y2="4.25"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></line>
              <line
                x1="6.25"
                y1="2.25"
                x2="6.25"
                y2="4.25"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></line>
              <path
                d="M4.25,4.25c.091,2.676,1.916,4.981,4.5,5.684"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M8.25,4.25c-.4,5.625-6,6-6,6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <polyline
                points="9.25 15.75 12.25 7.75 12.75 7.75 15.75 15.75"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-color="color-2"
              ></polyline>
              <line
                x1="10.188"
                y1="13.25"
                x2="14.813"
                y2="13.25"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-color="color-2"
              ></line>
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
            @if (langSwitcher().valueChanges | async; as lang) {
            {{ 'i18n.' + lang | translate }}
            } @else {
            {{ 'CHOOSE_LANGUAGE' | translate }}
            }
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
                    (click)="select('en', 'english')"
                  >
                    <img
                      class="w-4 h-3.5 mr-1.5 rounded object-cover"
                      alt=""
                      [src]="'./assets/flags/united-kingdom.svg'"
                    />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.english' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('it', 'italian')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/italy.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.italian' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('es', 'spanish')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/spain.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.spanish' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('fr', 'french')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/france.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.french' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('de', 'german')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/germany.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.german' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('pt', 'portuguese')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/portugal.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.portuguese' | translate
                    }}</span>
                  </li>
                  <li
                    class="flex flex-row items-center py-1.5 px-2 rounded-b-lg hover:bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                    (click)="select('ru', 'russian')"
                  >
                    <img class="w-4 h-3.5 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/russia.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-medium">{{
                      'LANGS.russian' | translate
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
export class TranslateDropdownComponent {
  isOpen = signal(false);
  isVisible = signal(false);

  langSwitcher = input.required<FormControl<string | null>>();

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

  select(lang: 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ru', i18n: string) {
    this.langSwitcher().patchValue(lang);
    this.close();
  }
}
