import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DialogService } from './dialog.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';
import { Dish } from '../../../store/public-menu/interface/public-menu';
import { MoneyPipe } from '../../../utils/pipes/money.pipe';

@UntilDestroy()
@Component({
  selector: 'dish-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, ReactiveFormsModule, MoneyPipe],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
        hidden: dialog.isAllowed() && !dialog.isDialogOpen(),
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
              'opacity-100 translate-y-0 sm:scale-100': dialog.isAllowed() && dialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': dialog.isAllowed() && !dialog.isDialogVisible()
            }"
            (clickOutside)="dialog.isAllowed() && dialog.isDialogVisible() && dialog.closeDialog()"
          >
            <div class="flex flex-row items-center justify-between mb-8">
              <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {{ dish()?.dish?.name }}
              </span>
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
                (click)="dialog.closeDialog()"
              >
                <span class="svg-icon-8 stroke-[1.6]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>xmark</title>
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

            <div>
              @if (dish()?.dish?.image; as image) {
              <img
                [src]="image"
                alt=""
                class="mb-6 h-64 sm:h-72 md:h-80 w-full object-cover object-center rounded-md shadow-sm"
              />
              }
            </div>

            <div>
              @if (dish()?.dish?.price; as price) { @if (dish()?.dish?.currency; as currency) {
              <p class="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
                {{ price | money : currentLang() : currency }}
              </p>
              } }
            </div>

            <div>
              @if (dish()?.dish?.description; as description) {
              <p class="mb-3 text-sm text-zinc-600 dark:text-zinc-400 w-full">
                {{ description }}
              </p>
              }
            </div>

            <div>
              @if (peanut() || milk() || gluten()) {
              <div class="flex flex-row gap-x-2 mb-1">
                @if (peanut()) {
                <div class="flex flex-row gap-x-1 bg-amber-100/80 dark:bg-amber-900/80 px-2 py-1.5 rounded-full">
                  <span class="svg-icon-9 text-amber-600 stroke-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="M435 218.4c18-18.1 29-42.9 29-70.4V80c0-17.7-14.3-32-32-32H364c-13.6 0-26.5 2.7-38.3 7.6l0 0c-11.7 4.8-22.7 12-32.3 21.6l-.3 .3 0 0c-9.6 9.6-16.7 20.6-21.5 32.2l0 0c-2.7 6.4-4.7 13.2-5.9 20.2l-.1 .4-.1 .4c-5.3 26.6-15.3 63.2-43.4 91.3s-64.7 38.2-91.3 43.4l-.4 .1-.4 .1c-7 1.3-13.8 3.3-20.2 5.9l0 0C98 276.4 87 283.6 77.3 293.3c-9.7 9.7-16.9 20.7-21.7 32.4l0 0C50.7 337.5 48 350.4 48 364v68c0 17.7 14.3 32 32 32h68c27.4 0 52.1-10.9 70.2-28.7l32.7 33.2-32.7-33.2c.4-.4 .8-.7 1.1-1.1l0 0c9.4-9.5 16.4-20.4 21.1-31.9l0 0c2.7-6.4 4.7-13.2 5.9-20.2l.1-.4 .1-.4c5.3-26.6 15.3-63.2 43.4-91.3s64.7-38.2 91.3-43.4l.4-.1 .4-.1c7-1.3 13.8-3.3 20.2-5.9l0 0c11.6-4.8 22.6-11.9 32.2-21.4l0 0 .6-.6 0 0zM512 148c0 40.6-16.4 77.4-42.9 104.2l-.9 .9c-14.1 14-30.3 24.6-47.6 31.7c-9.5 4-19.6 6.9-30 8.8c-24.5 4.8-49.1 12.6-66.7 30.3s-25.4 42.2-30.3 66.7c-1.9 10.4-4.9 20.5-8.8 30c-7.1 17.1-17.5 33.2-31.3 47.2c-.5 .6-1.1 1.1-1.7 1.7C225.1 495.8 188.5 512 148 512H80c-44.2 0-80-35.8-80-80V364c0-20.1 4-39.2 11.2-56.7c7.2-17.5 17.9-33.8 32.1-48c14.2-14.2 30.6-24.9 48.1-32.1c9.5-4 19.6-6.9 30-8.8c24.5-4.8 49.1-12.6 66.7-30.3s25.4-42.2 30.3-66.7c1.9-10.4 4.9-20.5 8.8-30C234.4 74 245 57.8 259.1 43.6l.4-.4c14.2-14.1 30.5-24.8 47.8-32C324.8 4 343.9 0 364 0h68c44.2 0 80 35.8 80 80v68zM372.8 136a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-64 64a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-192 192a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 372.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4zM372.8 200a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 308.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4z"
                      />
                    </svg>
                  </span>
                  <span class="text-amber-600 text-xs font-medium">
                    {{ 'PEANUTS' | translate }}
                  </span>
                </div>
                } @if (milk()) {
                <div class="flex flex-row gap-x-1 bg-sky-100/80 dark:bg-sky-900/80 px-2 py-1.5 rounded-full">
                  <span class="svg-icon-9 text-sky-500 stroke-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path
                        fill="currentColor"
                        d="M72 184c0-23 10.7-43.4 27.5-56.6C97.2 135.2 96 143.5 96 152V424v24h24 80 24V424 378.6c2.5 .6 5.2 1.2 8 1.7V392v16h32V392v-8.1c2.6 .1 5.3 .1 8 .1s5.4 0 8-.1V392v16h32V392 380.4c2.8-.5 5.5-1.1 8-1.7V424v24h24 80 24V424 267.7l16 20.6V336v7l3.8 5.9 56 88 7.1 11.1H544h72 24V424 264v-8.2l-5-6.5-11-14.2V224 168 144H576v24 5l-48.2-62.4C505.1 81.2 470 64 432.9 64H256 184 144C77.7 64 24 117.7 24 184v54C9.4 249.8 0 267.8 0 288v32H8c35.3 0 64-28.7 64-64V224 184zm91.2-66.1c3.6 12.3 10.3 23.6 19.5 32.8l7.4 7.4C211.8 179.8 241.3 192 272 192s60.2-12.2 81.9-33.9l7.4-7.4c10.7-10.7 17.9-24.1 21-38.6h50.5c22.3 0 43.3 10.3 57 28L592 272.2V400H557.2L512 329V280v-8.2l-5.1-6.5-56-72-7.2-9.3H432h-8H400v24V400H368V352v-8-8c0-53-43-96-96-96s-96 43-96 96v8 8 48H144V152c0-14.5 7.7-27.1 19.2-34.1zm62.4 211.4l-1.1-.4C228 305.7 247.9 288 272 288s44 17.7 47.5 40.9l-1.1 .4c-9.7 3.2-25.1 6.8-46.4 6.8s-36.7-3.5-46.4-6.8zM576 320a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"
                      />
                    </svg>
                  </span>
                  <span class="text-sky-500 text-xs font-medium">
                    {{ 'MILK' | translate }}
                  </span>
                </div>
                }@if (gluten()) {
                <div class="flex flex-row gap-x-1 bg-emerald-100/80 dark:bg-emerald-900/80 px-2 py-1.5 rounded-full">
                  <span class="svg-icon-9 text-emerald-500 stroke-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="M448 48c-22.1 0-40 17.9-40 40v16h16c22.1 0 40-17.9 40-40V48H448zM362.2 68.5C371.1 29.3 406.1 0 448 0h40c13.3 0 24 10.7 24 24V64c0 41.9-29.2 76.9-68.4 85.8c14.1 6.2 27.3 15.1 38.9 26.7l16.9 16.9c9.4 9.4 9.4 24.6 0 33.9l-16.9 16.9c-16.9 16.9-37.9 27.3-59.8 31.1c6.9 9.4 6.1 22.6-2.4 31.1l-16.9 16.9c-16.9 16.9-37.9 27.3-59.8 31.1c6.9 9.4 6.1 22.6-2.4 31.1l-16.9 16.9c-43.7 43.7-114.6 43.7-158.4 0l-11.2-11.2L41 505c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L120.6 357.5l0 0-11.3-11.3c-43.7-43.7-43.7-114.7 0-158.4l16.9-16.9c8.5-8.5 21.7-9.3 31.1-2.4c3.8-21.9 14.2-42.9 31.1-59.8l16.9-16.9c8.5-8.5 21.7-9.3 31.1-2.4c3.8-21.9 14.2-42.9 31.1-59.8l16.9-16.9c9.4-9.4 24.6-9.4 33.9 0l16.9 16.9C347 41 356 54.3 362.2 68.5zm-60.6 85.4L311.7 164c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zM222.4 233l10.1 10.1c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zm-79.2 79.2l10.1 10.1c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zm147 56.5c-27.4-27.3-69.6-30.7-100.6-10.2l10.1 10.2c25 25 65.5 25 90.5 0zm79.2-79.2c-27.4-27.3-69.6-30.7-100.6-10.2l10.1 10.1c25 25 65.5 25 90.5 0zm79.2-79.2C421.2 183 379 179.7 347.9 200.2l10.1 10.1c25 25 65.5 25 90.5 0z"
                      />
                    </svg>
                  </span>
                  <span class="text-emerald-500 text-xs font-medium">
                    {{ 'GLUTEN' | translate }}
                  </span>
                </div>
                }
              </div>
              }
            </div>
            <button
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 mt-6 mb-1 xl:col-span-1 rounded-xl w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/30"
              (click)="dialog.closeDialog()"
            >
              <div
                class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[11px] cursor-pointer"
              >
                <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DishDialogComponent {
  dialog = inject(DialogService);
  dish = input<Dish>();
  currentLang = input.required<string>();

  peanut = computed(() => this.dish()?.dish?.allergens?.includes('peanuts'));
  milk = computed(() => this.dish()?.dish?.allergens?.includes('milk'));
  gluten = computed(() => this.dish()?.dish?.allergens?.includes('gluten'));
}
