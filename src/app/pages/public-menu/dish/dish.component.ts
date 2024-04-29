import { Component, EventEmitter, Output, computed, effect, input } from '@angular/core';
import { Dish } from '../../../store/public-menu/interface/public-menu';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '../../../utils/pipes/money.pipe';

@Component({
  selector: 'dish',
  standalone: true,
  imports: [CommonModule, TranslateModule, MoneyPipe],
  template: `
    <a
      class="group relative flex flex-col transition ease-in-out duration-100 items-start justify-between ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-2xl shadow-sm shadow-black/20 dark:shadow-black/40 hover:shadow-md bg-white dark:bg-[#1A1A1A] h-full pb-3"
      (click)="open.emit(dish())"
    >
      <div>
        <div
          class="h-44 sm:h-52 md:h-60 w-full overflow-hidden rounded-t-2xl p-3 bg-white dark:bg-[#1A1A1A] group-hover:opacity-80 transition ease-in-out duration-100"
        >
          @if (dish().dish.image) {
          <div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg p-6">
            <span aria-hidden="true" class="absolute inset-0">
              <img [src]="dish().dish.image" alt="" class="h-full rounded-lg w-full object-cover object-center" />
            </span>
          </div>
          } @else {
          <div class="flex flex-col items-center justify-center gap-y-2 h-full w-full object-cover object-center">
            <span class="text-zinc-900 dark:text-zinc-100 svg-icon-1 stroke-[1.6]">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                <title>image sparkle 3</title>
                <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                  <path
                    d="M4,14.75l5.836-5.836c.781-.781,2.047-.781,2.828,0l3.586,3.586"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M16.25,8.5v4.25c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V5.25c0-1.105,.895-2,2-2h5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <circle cx="5.75" cy="7.25" r="1.25" fill="currentColor" stroke="none"></circle>
                  <polygon
                    points="14.25 .75 15.1 2.9 17.25 3.75 15.1 4.6 14.25 6.75 13.4 4.6 11.25 3.75 13.4 2.9 14.25 .75"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></polygon>
                </g>
              </svg>
            </span>
            <span class="text-zinc-900 dark:text-zinc-100 font-semibold">
              {{ 'NO_IMAGE' | translate }}
            </span>
          </div>
          }
        </div>
        <div class="flex flex-col gap-y-1.5 px-4 pb-3">
          <h3 class="text-lg w-44 sm:w-52 md:w-56 truncate font-bold text-zinc-700 dark:text-zinc-300">
            <span class="absolute inset-0"></span>
            <span>{{ dish().dish.name }}</span>
          </h3>
          <p class="text-sm text-zinc-500/80 dark:text-zinc-600 w-52 sm:w-56 md:w-60 line-clamp-2">
            {{ dish().dish.description }}
          </p>
          <p class="text-base font-bold text-zinc-800 dark:text-zinc-200 drop-shadow-sm">
            {{ dish().dish.price | money : currentLang() : dish().dish.currency }}
          </p>
        </div>
      </div>
      @if (peanut() || milk() || gluten()) {
      <div class="flex flex-row gap-x-2 px-3 mb-1">
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
    </a>
  `,
})
export class DishComponent {
  dish = input.required<Dish>();
  currentLang = input.required<string>();

  @Output() open = new EventEmitter<Dish>();

  peanut = computed(() => this.dish()?.dish?.allergens?.includes('peanuts'));
  milk = computed(() => this.dish()?.dish?.allergens?.includes('milk'));
  gluten = computed(() => this.dish()?.dish?.allergens?.includes('gluten'));
}
