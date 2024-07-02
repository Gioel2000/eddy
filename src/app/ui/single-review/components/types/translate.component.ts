import { Component, EventEmitter, Output, WritableSignal, inject, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

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
        for="name"
        class="absolute -top-2 left-2 inline-block bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
      >
        <span [inlineSVG]="'language.svg'" class="svg-icon svg-icon-8 text-zinc-500 stroke-[1.8]"></span>
      </label>
      <button
        type="button"
        class="block w-full ring-1  ring-zinc-300 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        (click)="toggle()"
      >
        <div class="flex flex-row items-center justify-between">
          <span class="truncate max-w-full font-semibold text-zinc-700 dark:text-zinc-300">
            @if (label()) {
            {{ 'LANGS.' + label()! | translate }}
            } @else {
            {{ 'CHOOSE_LANGUAGE' | translate }}
            }
          </span>
          <span
            [inlineSVG]="'chevron-down.svg'"
            class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
          ></span>
        </div>
      </button>
      <div [ngClass]="{ hidden: !isOpen() }">
        <div
          class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-300 dark:ring-zinc-800 focus:outline-none transition ease-out duration-200"
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
                <ul role="list" class="divide-y divide-zinc-200 dark:divide-zinc-700">
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('en', 'english')">
                    <img
                      class="w-5 h-4 mr-1.5 rounded object-cover"
                      alt=""
                      [src]="'./assets/flags/united-kingdom.svg'"
                    />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.english' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('it', 'italian')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/italy.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.italian' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('es', 'spanish')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/spain.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.spanish' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('fr', 'french')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/france.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.french' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('de', 'german')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/germany.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.german' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('pt', 'portuguese')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/portugal.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
                      'LANGS.portuguese' | translate
                    }}</span>
                  </li>
                  <li class="flex flex-row items-center py-2 px-3 cursor-pointer" (click)="select('ru', 'russian')">
                    <img class="w-5 h-4 mr-1.5 rounded object-cover" alt="" [src]="'./assets/flags/russia.svg'" />
                    <span class="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">{{
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
  label: WritableSignal<string | null> = signal(null);

  @Output() selected = new EventEmitter<'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ru'>();

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
    this.selected.emit(lang);
    this.label.set(i18n);
    this.close();
  }
}
