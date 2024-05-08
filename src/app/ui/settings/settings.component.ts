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
      <div
        class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
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
                <span class="svg-icon svg-icon-8 stroke-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                    <title>xmark</title>
                    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                      <line x1="2.25" y1="9.75" x2="9.75" y2="2.25"></line>
                      <line x1="9.75" y1="9.75" x2="2.25" y2="2.25"></line>
                    </g>
                  </svg>
                </span>
              </button>
            </div>

            <div>
              <div class="block">
                <div class="border-b-[1.2px] border-zinc-200 dark:border-zinc-700/50">
                  <nav class="-mb-px flex space-x-8">
                    <a
                      class="cursor-pointer text-zinc-500 hover:border-zinc-300 hover:dark:border-zinc-700/50 hover:text-zinc-700 hover:dark:text-zinc-300 flex flex-col justify-center items-center border-b-2 py-2 px-1 text-xs font-semibold"
                      [ngClass]="{
                        'border-black dark:border-white text-black dark:text-white':
                          dialog.optionSelected() === 'theme',
                        'border-transparent': dialog.optionSelected() !== 'theme'
                      }"
                      (click)="dialog.optionSelected.set('theme')"
                    >
                      <span
                        class="svg-icon svg-icon-1 mb-2 stroke-[1.6]"
                        [ngClass]="{ 'text-black dark:text-white': dialog.optionSelected() === 'theme' }"
                        ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <title>window-paintbrush</title>
                          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                            <path
                              d="M11.75,9.247l5.086-5.083c.552-.552,.552-1.448,0-2-.552-.552-1.448-.552-2,0l-5.094,5.096"
                            ></path>
                            <path
                              d="M5.75,11.815c2.162,.65,3.917,.704,5.351-.764,.865-.868,.865-2.276,0-3.145s-2.261-.881-3.133,0c-1.418,1.434-.18,2.795-2.218,3.909Z"
                            ></path>
                            <path
                              d="M16.25,8.284v4.966c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V4.75c0-1.105,.895-2,2-2h6.965"
                            ></path>
                            <circle
                              cx="4.25"
                              cy="5.25"
                              r=".75"
                              fill="currentColor"
                              data-stroke="none"
                              stroke="none"
                            ></circle>
                            <circle
                              cx="6.75"
                              cy="5.25"
                              r=".75"
                              fill="currentColor"
                              data-stroke="none"
                              stroke="none"
                            ></circle>
                          </g>
                        </svg>
                      </span>
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
                        class="svg-icon svg-icon-1 mb-2 stroke-[1.6]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <title>language</title>
                          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                            <line x1="2.25" y1="4.25" x2="10.25" y2="4.25"></line>
                            <line x1="6.25" y1="2.25" x2="6.25" y2="4.25"></line>
                            <path d="M4.25,4.25c.091,2.676,1.916,4.981,4.5,5.684"></path>
                            <path d="M8.25,4.25c-.4,5.625-6,6-6,6"></path>
                            <polyline points="9.25 15.75 12.25 7.75 12.75 7.75 15.75 15.75"></polyline>
                            <line x1="10.188" y1="13.25" x2="14.813" y2="13.25"></line>
                          </g>
                        </svg>
                      </span>
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
                      'bg-accent dark:bg-accentDark text-white': lang.selected,
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
                      class="relative inline-flex items-center rounded-l-md bg-white dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-zinc-300 dark:ring-zinc-700 focus:z-10"
                      [disabled]="start() === 0"
                      (click)="prev()"
                    >
                      <span class="svg-icon svg-icon-8 stroke-[0.8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                          <title>arrow-left</title>
                          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                            <line x1="11" y1="6" x2="1.25" y2="6"></line>
                            <polyline points="4.25 2.75 1 6 4.25 9.25"></polyline>
                          </g>
                        </svg>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="relative -ml-px inline-flex items-center rounded-r-md bg-white dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-zinc-300 dark:ring-zinc-700 focus:z-10"
                      [disabled]="end() >= i18n.languages().length"
                      (click)="next()"
                    >
                      <span class="svg-icon svg-icon-8 stroke-[0.8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                          <title>arrow-right</title>
                          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
                            <line x1="1" y1="6" x2="10.75" y2="6"></line>
                            <polyline points="7.75 9.25 11 6 7.75 2.75"></polyline>
                          </g>
                        </svg>
                      </span>
                    </button>
                  </span>
                </div>
              </div>
              } }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
