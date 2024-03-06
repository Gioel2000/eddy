import { Component, inject, signal } from '@angular/core';
import { SettingsService } from './settings.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { I18nStore } from '../../store/i18n/i18n.service';
import { ThemeManagerStore } from '../../store/theme/theme.service';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective],
  template: ` <div
    class="relative z-[10000]"
    [ngClass]="{
      hidden: !dialog.isDialogOpen(),
    }"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
          [ngClass]="{
            'opacity-100 translate-y-0 sm:scale-100': dialog.isDialogVisible(),
            'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !dialog.isDialogVisible()
          }"
          (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
        >
          <div class="flex flex-row items-center justify-between mb-8">
            <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'SETTINGS' | translate }}
            </span>

            <button
              type="button"
              class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
              (click)="dialog.closeDialog()"
            >
              <span class="svg-icon-8" inlineSVG="xmark.svg"></span>
            </button>
          </div>

          <div>
            <div class="block">
              <div class="border-b-[1.2px] border-zinc-200 dark:border-zinc-700/50">
                <nav class="-mb-px flex space-x-8">
                  <a
                    class="cursor-pointer text-zinc-500 hover:border-zinc-300 hover:dark:border-zinc-700/50 hover:text-zinc-700 hover:dark:text-zinc-300 flex flex-col justify-center items-center border-b-2 py-2 px-1 text-xs font-semibold"
                    [ngClass]="{
                      'border-black dark:border-white text-black dark:text-white': dialog.optionSelected() === 'theme',
                      'border-transparent': dialog.optionSelected() !== 'theme'
                    }"
                    (click)="dialog.optionSelected.set('theme')"
                  >
                    <span
                      class="svg-icon-1 mb-2"
                      [ngClass]="{ 'text-black dark:text-white': dialog.optionSelected() === 'theme' }"
                      inlineSVG="window-paintbrush.svg"
                    ></span>
                    <span [ngClass]="{ 'text-black dark:text-white': dialog.optionSelected() === 'theme' }">{{
                      'THEME' | translate
                    }}</span>
                  </a>

                  <a
                    class="cursor-pointer text-zinc-500 hover:border-zinc-300 hover:dark:border-zinc-700/50 hover:text-zinc-700 hover:dark:text-zinc-300 flex flex-col justify-center items-center border-b-2 py-2 px-1 text-xs font-semibold"
                    [ngClass]="{
                      'border-black dark:border-white text-black dark:text-white':
                        dialog.optionSelected() === 'language',
                      'border-transparent': dialog.optionSelected() !== 'language'
                    }"
                    (click)="dialog.optionSelected.set('language')"
                  >
                    <span
                      [ngClass]="{ 'text-black dark:text-white': dialog.optionSelected() === 'language' }"
                      class="svg-icon-1 mb-2"
                      inlineSVG="language.svg"
                    ></span>
                    <span [ngClass]="{ 'text-black dark:text-white': dialog.optionSelected() === 'language' }">{{
                      'LANGUAGE' | translate
                    }}</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>

          <div>
            @switch (dialog.optionSelected()) { @case ('theme') {
            <div class="py-4 sm:py-6">
              <div class="grid gap-5 sm:gap-10 grid-cols-3">
                <div class="col-span-1 flex flex-col">
                  <a
                    class="hover:ring-4 hover:ring-accent hover:shadow-lg hover:shadow-accent/70 cursor-pointer transition ease-in-out duration-200 rounded-lg bg-zinc-100 border border-zinc-300 w-full h-full pt-4 pl-8"
                    [ngClass]="{
                      'ring-4 ring-accent shadow-lg shadow-accent/70': themeStore.option() === 'light'
                    }"
                    (click)="themeStore.set$.next('light')"
                  >
                    <div
                      class="rounded-tl-lg rounded-br-lg bg-zinc-50 border-l border-t border-zinc-300 w-full h-14 pt-2 pl-3"
                    ></div>
                  </a>
                  <span class="mt-2 text-zinc-800 dark:text-zinc-200 text-sm font-semibold">Light</span>
                </div>

                <div class="col-span-1 flex flex-col">
                  <a
                    class="hover:ring-4 hover:ring-accent hover:shadow-lg hover:shadow-accent/70 cursor-pointer transition ease-in-out duration-100 rounded-lg bg-zinc-900 border border-zinc-900 w-full h-full pt-4 pl-8"
                    [ngClass]="{
                      'ring-4 ring-accent shadow-lg shadow-accent/70': themeStore.option() === 'dark'
                    }"
                    (click)="themeStore.set$.next('dark')"
                  >
                    <div
                      class="rounded-tl-lg rounded-br-lg bg-zinc-900 border-l border-t border-zinc-700 w-full h-14 pt-2 pl-3"
                    ></div>
                  </a>
                  <span class="mt-2 text-zinc-800 dark:text-zinc-200 text-sm font-semibold">Dark</span>
                </div>

                <div class="col-span-1 flex flex-col">
                  <a
                    class="hover:ring-4 hover:ring-accent hover:shadow-lg hover:shadow-accent/70 cursor-pointer transition ease-in-out duration-100 flex flex-row rounded-lg border border-zinc-300 dark:border-zinc-700/50"
                    [ngClass]="{
                      'ring-4 ring-accent shadow-lg shadow-accent/70': themeStore.option() === 'system'
                    }"
                    (click)="themeStore.set$.next('system')"
                  >
                    <div
                      class="rounded-l-md bg-zinc-900 w-full h-full pt-4 pl-4 border-r border-zinc-300 dark:border-zinc-700/50"
                    >
                      <div
                        class="rounded-tl-lg rounded-br-lg bg-zinc-900 border-l border-t border-zinc-700 w-full h-14 pt-2 pl-3"
                      ></div>
                    </div>
                    <div class="rounded-r-md bg-zinc-100 w-full h-full pt-4 pl-4">
                      <div
                        class="rounded-tl-lg rounded-br-lg bg-zinc-50 border-l border-t border-zinc-300 w-full h-14 pt-2 pl-3"
                      ></div>
                    </div>
                  </a>
                  <span class="mt-2 text-zinc-800 dark:text-zinc-200 text-sm font-semibold">{{
                    'SYSTEM' | translate
                  }}</span>
                </div>
              </div>
            </div>
            } @case ('language') {
            <div class="pt-4 sm:pt-6">
              <div class="grid gap-3 grid-cols-2">
                @for (lang of i18n.languages().slice(start(), end()); track $index) {
                <div
                  class="flex flex-row items-center col-span-1 rounded-lg p-3 cursor-pointer dark:cursor-pointer"
                  [ngClass]="{
                    'bg-accent text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]': lang.selected,
                    'text-zinc-800 dark:text-zinc-200 bg-black/5 dark:bg-zinc-50/5': !lang.selected
                  }"
                  (click)="i18n.setLocale$.next(lang.locale)"
                >
                  <img
                    src="assets/flags/{{ lang.flag }}.svg"
                    class="rounded-full mr-3 w-6 h-6 border-2"
                    [ngClass]="{
                      'border-white/40': lang.selected,
                      'border-transparent': !lang.selected
                    }"
                  />
                  <span class="font-medium text-sm">{{ lang.name }}</span>
                </div>
                }
              </div>
              <div class="flex flew-row items-end w-full mt-6">
                <span class="isolate inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    class="relative inline-flex items-center rounded-l-md bg-zinc-50 dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700/50 focus:z-10"
                    [disabled]="start() === 0"
                    (click)="prev()"
                  >
                    <span class="svg-icon-8" inlineSVG="arrow-left.svg"></span>
                  </button>
                  <button
                    type="button"
                    class="relative -ml-px inline-flex items-center rounded-r-md bg-zinc-50 dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700/50 focus:z-10"
                    [disabled]="end() >= i18n.languages().length"
                    (click)="next()"
                  >
                    <span class="svg-icon-8" inlineSVG="arrow-right.svg"></span>
                  </button>
                </span>
              </div>
            </div>
            } }
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class SettingsComponent {
  dialog = inject(SettingsService);
  themeStore = inject(ThemeManagerStore);
  i18n = inject(I18nStore);

  langsPerPage = 10;
  start = signal(0);
  end = signal(10);

  next() {
    this.start.set(this.start() + this.langsPerPage);
    this.end.set(this.end() + this.langsPerPage);
  }

  prev() {
    this.start.set(this.start() - this.langsPerPage);
    this.end.set(this.end() - this.langsPerPage);
  }
}
