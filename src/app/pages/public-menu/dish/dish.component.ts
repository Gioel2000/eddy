import { Component, EventEmitter, Output, computed, input } from '@angular/core';
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
      class="group relative flex flex-col w-[18rem] transition ease-in-out duration-100 items-start justify-between ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl shadow-sm shadow-black/20 dark:shadow-black/40 hover:shadow-md bg-white dark:bg-[#1A1A1A] h-full pb-3"
      (click)="open.emit(dish())"
    >
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
          <span class="text-zinc-900 dark:text-zinc-100 svg-icon svg-icon-1 stroke-[1.6]">
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
      @if (peanut() || milk() || gluten() || crustaceans() || eggs() || fish() || soy() || celery()) {
      <div class="grid grid-rows-[masonry] grid-flow-dense gap-2 grid-cols-3 px-3 w-full">
        @if (peanut()) {
        <div class="flex flex-row gap-x-1 bg-amber-100/80 dark:bg-amber-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-amber-600 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M435 218.4c18-18.1 29-42.9 29-70.4V80c0-17.7-14.3-32-32-32H364c-13.6 0-26.5 2.7-38.3 7.6l0 0c-11.7 4.8-22.7 12-32.3 21.6l-.3 .3 0 0c-9.6 9.6-16.7 20.6-21.5 32.2l0 0c-2.7 6.4-4.7 13.2-5.9 20.2l-.1 .4-.1 .4c-5.3 26.6-15.3 63.2-43.4 91.3s-64.7 38.2-91.3 43.4l-.4 .1-.4 .1c-7 1.3-13.8 3.3-20.2 5.9l0 0C98 276.4 87 283.6 77.3 293.3c-9.7 9.7-16.9 20.7-21.7 32.4l0 0C50.7 337.5 48 350.4 48 364v68c0 17.7 14.3 32 32 32h68c27.4 0 52.1-10.9 70.2-28.7l32.7 33.2-32.7-33.2c.4-.4 .8-.7 1.1-1.1l0 0c9.4-9.5 16.4-20.4 21.1-31.9l0 0c2.7-6.4 4.7-13.2 5.9-20.2l.1-.4 .1-.4c5.3-26.6 15.3-63.2 43.4-91.3s64.7-38.2 91.3-43.4l.4-.1 .4-.1c7-1.3 13.8-3.3 20.2-5.9l0 0c11.6-4.8 22.6-11.9 32.2-21.4l0 0 .6-.6 0 0zM512 148c0 40.6-16.4 77.4-42.9 104.2l-.9 .9c-14.1 14-30.3 24.6-47.6 31.7c-9.5 4-19.6 6.9-30 8.8c-24.5 4.8-49.1 12.6-66.7 30.3s-25.4 42.2-30.3 66.7c-1.9 10.4-4.9 20.5-8.8 30c-7.1 17.1-17.5 33.2-31.3 47.2c-.5 .6-1.1 1.1-1.7 1.7C225.1 495.8 188.5 512 148 512H80c-44.2 0-80-35.8-80-80V364c0-20.1 4-39.2 11.2-56.7c7.2-17.5 17.9-33.8 32.1-48c14.2-14.2 30.6-24.9 48.1-32.1c9.5-4 19.6-6.9 30-8.8c24.5-4.8 49.1-12.6 66.7-30.3s25.4-42.2 30.3-66.7c1.9-10.4 4.9-20.5 8.8-30C234.4 74 245 57.8 259.1 43.6l.4-.4c14.2-14.1 30.5-24.8 47.8-32C324.8 4 343.9 0 364 0h68c44.2 0 80 35.8 80 80v68zM372.8 136a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-64 64a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-192 192a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 372.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4zM372.8 200a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 308.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4z"
              />
            </svg>
          </span>
          <span class="text-amber-600 text-xs font-medium truncate">
            {{ 'PEANUTS' | translate }}
          </span>
        </div>
        } @if (milk()) {
        <div class="flex flex-row gap-x-1 bg-sky-100/80 dark:bg-sky-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-sky-500 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path
                fill="currentColor"
                d="M72 184c0-23 10.7-43.4 27.5-56.6C97.2 135.2 96 143.5 96 152V424v24h24 80 24V424 378.6c2.5 .6 5.2 1.2 8 1.7V392v16h32V392v-8.1c2.6 .1 5.3 .1 8 .1s5.4 0 8-.1V392v16h32V392 380.4c2.8-.5 5.5-1.1 8-1.7V424v24h24 80 24V424 267.7l16 20.6V336v7l3.8 5.9 56 88 7.1 11.1H544h72 24V424 264v-8.2l-5-6.5-11-14.2V224 168 144H576v24 5l-48.2-62.4C505.1 81.2 470 64 432.9 64H256 184 144C77.7 64 24 117.7 24 184v54C9.4 249.8 0 267.8 0 288v32H8c35.3 0 64-28.7 64-64V224 184zm91.2-66.1c3.6 12.3 10.3 23.6 19.5 32.8l7.4 7.4C211.8 179.8 241.3 192 272 192s60.2-12.2 81.9-33.9l7.4-7.4c10.7-10.7 17.9-24.1 21-38.6h50.5c22.3 0 43.3 10.3 57 28L592 272.2V400H557.2L512 329V280v-8.2l-5.1-6.5-56-72-7.2-9.3H432h-8H400v24V400H368V352v-8-8c0-53-43-96-96-96s-96 43-96 96v8 8 48H144V152c0-14.5 7.7-27.1 19.2-34.1zm62.4 211.4l-1.1-.4C228 305.7 247.9 288 272 288s44 17.7 47.5 40.9l-1.1 .4c-9.7 3.2-25.1 6.8-46.4 6.8s-36.7-3.5-46.4-6.8zM576 320a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"
              />
            </svg>
          </span>
          <span class="text-sky-600 text-xs font-medium truncate">
            {{ 'MILK' | translate }}
          </span>
        </div>
        } @if (gluten()) {
        <div class="flex flex-row gap-x-1 bg-emerald-100/80 dark:bg-emerald-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-emerald-500 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M448 48c-22.1 0-40 17.9-40 40v16h16c22.1 0 40-17.9 40-40V48H448zM362.2 68.5C371.1 29.3 406.1 0 448 0h40c13.3 0 24 10.7 24 24V64c0 41.9-29.2 76.9-68.4 85.8c14.1 6.2 27.3 15.1 38.9 26.7l16.9 16.9c9.4 9.4 9.4 24.6 0 33.9l-16.9 16.9c-16.9 16.9-37.9 27.3-59.8 31.1c6.9 9.4 6.1 22.6-2.4 31.1l-16.9 16.9c-16.9 16.9-37.9 27.3-59.8 31.1c6.9 9.4 6.1 22.6-2.4 31.1l-16.9 16.9c-43.7 43.7-114.6 43.7-158.4 0l-11.2-11.2L41 505c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L120.6 357.5l0 0-11.3-11.3c-43.7-43.7-43.7-114.7 0-158.4l16.9-16.9c8.5-8.5 21.7-9.3 31.1-2.4c3.8-21.9 14.2-42.9 31.1-59.8l16.9-16.9c8.5-8.5 21.7-9.3 31.1-2.4c3.8-21.9 14.2-42.9 31.1-59.8l16.9-16.9c9.4-9.4 24.6-9.4 33.9 0l16.9 16.9C347 41 356 54.3 362.2 68.5zm-60.6 85.4L311.7 164c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zM222.4 233l10.1 10.1c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zm-79.2 79.2l10.1 10.1c20.5-31 17.2-73.3-10.2-100.6c-25 25-25 65.5 0 90.5zm147 56.5c-27.4-27.3-69.6-30.7-100.6-10.2l10.1 10.2c25 25 65.5 25 90.5 0zm79.2-79.2c-27.4-27.3-69.6-30.7-100.6-10.2l10.1 10.1c25 25 65.5 25 90.5 0zm79.2-79.2C421.2 183 379 179.7 347.9 200.2l10.1 10.1c25 25 65.5 25 90.5 0z"
              />
            </svg>
          </span>
          <span class="text-emerald-600 text-xs font-medium truncate">
            {{ 'GLUTEN' | translate }}
          </span>
        </div>
        } @if (crustaceans()) {
        <div class="flex flex-row gap-x-1 bg-blue-100/80 dark:bg-blue-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-blue-500 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M.2 120l0 0 0 0C4.4 53 60 0 128 0h44.7c7.1 0 10.7 8.6 5.7 13.7L141.7 50.3c-5 5-1.5 13.7 5.7 13.7H184c4.4 0 8.1 3.6 7.5 8c-3.9 31.6-30.9 56-63.5 56H48v33.3c0 9.4 5.4 17.9 13.9 21.8L133.3 216c16.9-12.2 37-20.3 58.7-23V152c0-13.3 10.7-24 24-24s24 10.7 24 24v40h32V152c0-13.3 10.7-24 24-24s24 10.7 24 24v41c21.7 2.7 41.7 10.9 58.7 23l71.4-32.9c8.5-3.9 13.9-12.4 13.9-21.8V128H384c-32.6 0-59.6-24.4-63.5-56c-.5-4.4 3.1-8 7.5-8h36.7c7.1 0 10.7-8.6 5.7-13.7L333.7 13.7c-5-5-1.5-13.7 5.7-13.7H384c68 0 123.6 53 127.8 120l0 0 0 0c0 .1 0 .3 0 .4l.2 7.6h-7.9l-.1 0h8v33.3c0 28.1-16.3 53.6-41.8 65.4L413.1 253c2.2 3.6 4.2 7.2 6 11h31.2l26.9-13.5c11.9-5.9 26.3-1.1 32.2 10.7s1.1 26.3-10.7 32.2l-32 16c-3.3 1.7-7 2.5-10.7 2.5H431.8c.2 2.6 .2 5.3 .2 8v1.4l23.6 7.9c3.5 1.2 6.7 3.2 9.4 5.8l32 32c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-28-28-30-10L387 381l36.6 12.2c3.5 1.2 6.7 3.2 9.4 5.8l32 32c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-28-28-54-18-2.2 2.2L371.7 435c7.6 4.2 12.3 12.3 12.3 21v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V470.1L297.9 449c-.6-.3-1.1-.6-1.6-1H215.7c-.5 .3-1.1 .7-1.6 1L176 470.1V488c0 13.3-10.7 24-24 24s-24-10.7-24-24V456c0-8.7 4.7-16.7 12.3-21l24.9-13.8L163 419l-54 18L81 465c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l32-32c2.6-2.6 5.8-4.6 9.4-5.8L125 381 107 363 77 373 49 401c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l32-32c2.6-2.6 5.8-4.6 9.4-5.8L80 321.4V320c0-2.7 .1-5.4 .2-8H56c-3.7 0-7.4-.9-10.7-2.5l-32-16C1.4 287.5-3.4 273.1 2.5 261.3s20.3-16.7 32.2-10.7L61.7 264H92.9c1.8-3.8 3.9-7.4 6-11L41.8 226.7C16.3 214.9 0 189.4 0 161.3V128H8l-.1 0H0l.2-7.6c0-.1 0-.3 0-.4zM296 240H216h-8c-42.9 0-77.9 33.8-79.9 76.2L211.9 400h88.2l83.8-83.8c-2-42.4-37-76.2-79.9-76.2h-8z"
              />
            </svg>
          </span>
          <span class="text-blue-600 text-xs font-medium truncate">
            {{ 'CRUSTACEANS' | translate }}
          </span>
        </div>
        } @if (eggs()) {
        <div class="flex flex-row gap-x-1 bg-yellow-100/80 dark:bg-yellow-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-yellow-500 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path
                fill="currentColor"
                d="M192 448c-74.7 0-144-75.4-144-160c0-48.3 14.1-107.7 41.3-153.5C116.4 88.8 151.1 64 192 64s75.6 24.8 102.7 70.5C321.9 180.3 336 239.7 336 288c0 84.6-69.3 160-144 160zM0 288C0 394 86 496 192 496s192-102 192-208c0-112-64-272-192-272S0 176 0 288zM170.8 134c6.5-6 7-16.1 1-22.6s-16.1-7-22.6-1c-23.9 21.8-41.1 52.7-52.3 84.2C85.7 226.1 80 259.7 80 288c0 8.8 7.2 16 16 16s16-7.2 16-16c0-24.5 5-54.4 15.1-82.8c10.1-28.5 25-54.1 43.7-71.2z"
              />
            </svg>
          </span>
          <span class="text-yellow-600 text-xs font-medium truncate">
            {{ 'EGGS' | translate }}
          </span>
        </div>
        } @if (fish()) {
        <div class="flex flex-row gap-x-1 bg-cyan-100/80 dark:bg-cyan-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-cyan-500 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path
                fill="currentColor"
                d="M180.8 303.7c9.2 10.4 19.4 20.6 30.7 30.1c33.7 28.5 76 50.2 124.5 50.2s90.8-21.8 124.5-50.2c30.3-25.5 52.7-55.7 65.3-77.8c-12.6-22.1-35-52.2-65.3-77.8C426.8 149.7 384.5 128 336 128s-90.8 21.7-124.5 50.2c-11.3 9.5-21.5 19.7-30.7 30.1c-14 15.8-36.7 20.6-56 11.8L70.6 195.3l21.1 36.9c8.4 14.8 8.4 32.9 0 47.6L70.6 316.7l54.3-24.9c19.2-8.8 41.9-4 56 11.8zM4.2 336.1L50 256 4.2 175.9c-6.9-12.1-5.2-27.2 4.2-37.5s24.3-13.3 36.9-7.5l99.5 45.6c10.5-11.9 22.5-23.8 35.7-35C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8c4.7 9.2 4.7 20.1 0 29.3c-14.1 27.4-41.9 66.8-81 99.8C452.3 403.5 399.4 432 336 432s-116.3-28.5-155.5-61.5c-13.2-11.2-25.1-23.1-35.7-35L45.3 381.1c-12.6 5.8-27.6 2.8-36.9-7.5S-2.7 348.2 4.2 336.1zM416 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
              />
            </svg>
          </span>
          <span class="text-cyan-600 text-xs font-medium truncate">
            {{ 'FISH' | translate }}
          </span>
        </div>
        } @if (soy()) {
        <div class="flex flex-row gap-x-1 bg-orange-100/80 dark:bg-orange-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-orange-600 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M435 218.4c18-18.1 29-42.9 29-70.4V80c0-17.7-14.3-32-32-32H364c-13.6 0-26.5 2.7-38.3 7.6l0 0c-11.7 4.8-22.7 12-32.3 21.6l-.3 .3 0 0c-9.6 9.6-16.7 20.6-21.5 32.2l0 0c-2.7 6.4-4.7 13.2-5.9 20.2l-.1 .4-.1 .4c-5.3 26.6-15.3 63.2-43.4 91.3s-64.7 38.2-91.3 43.4l-.4 .1-.4 .1c-7 1.3-13.8 3.3-20.2 5.9l0 0C98 276.4 87 283.6 77.3 293.3c-9.7 9.7-16.9 20.7-21.7 32.4l0 0C50.7 337.5 48 350.4 48 364v68c0 17.7 14.3 32 32 32h68c27.4 0 52.1-10.9 70.2-28.7l32.7 33.2-32.7-33.2c.4-.4 .8-.7 1.1-1.1l0 0c9.4-9.5 16.4-20.4 21.1-31.9l0 0c2.7-6.4 4.7-13.2 5.9-20.2l.1-.4 .1-.4c5.3-26.6 15.3-63.2 43.4-91.3s64.7-38.2 91.3-43.4l.4-.1 .4-.1c7-1.3 13.8-3.3 20.2-5.9l0 0c11.6-4.8 22.6-11.9 32.2-21.4l0 0 .6-.6 0 0zM512 148c0 40.6-16.4 77.4-42.9 104.2l-.9 .9c-14.1 14-30.3 24.6-47.6 31.7c-9.5 4-19.6 6.9-30 8.8c-24.5 4.8-49.1 12.6-66.7 30.3s-25.4 42.2-30.3 66.7c-1.9 10.4-4.9 20.5-8.8 30c-7.1 17.1-17.5 33.2-31.3 47.2c-.5 .6-1.1 1.1-1.7 1.7C225.1 495.8 188.5 512 148 512H80c-44.2 0-80-35.8-80-80V364c0-20.1 4-39.2 11.2-56.7c7.2-17.5 17.9-33.8 32.1-48c14.2-14.2 30.6-24.9 48.1-32.1c9.5-4 19.6-6.9 30-8.8c24.5-4.8 49.1-12.6 66.7-30.3s25.4-42.2 30.3-66.7c1.9-10.4 4.9-20.5 8.8-30C234.4 74 245 57.8 259.1 43.6l.4-.4c14.2-14.1 30.5-24.8 47.8-32C324.8 4 343.9 0 364 0h68c44.2 0 80 35.8 80 80v68zM372.8 136a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-64 64a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zm-192 192a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 372.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4zM372.8 200a19.2 19.2 0 1 1 38.4 0 19.2 19.2 0 1 1 -38.4 0zM200 308.8a19.2 19.2 0 1 1 0 38.4 19.2 19.2 0 1 1 0-38.4z"
              />
            </svg>
          </span>
          <span class="text-orange-600 text-xs font-medium truncate">
            {{ 'SOY' | translate }}
          </span>
        </div>
        } @if (celery()) {
        <div class="flex flex-row gap-x-1 bg-green-100/80 dark:bg-green-900/80 px-2 py-1.5 rounded-full w-full">
          <span class="svg-icon svg-icon-9 text-green-600 stroke-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M307.3 207c82.9-9.1 148.4-75.6 156-159H456c-76.7 0-142 49.1-166.1 117.5c-8.8-16.8-19.4-32.6-31.6-47.1C296.1 48 370.5 0 456 0h24c17.7 0 32 14.3 32 32c0 113.6-84.6 207.4-194.2 222c-2.1-16.2-5.6-31.9-10.5-47.1zM48 112v16c0 97.2 78.8 176 176 176h8V288c0 0 0 0 0 0c0-97.2-78.8-176-176-176H48zM280 288v16 48l0 136c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-136h-8C100.3 352 0 251.7 0 128V96C0 78.3 14.3 64 32 64H56c123.7 0 224 100.3 224 224z"
              />
            </svg>
          </span>
          <span class="text-green-600 text-xs font-medium truncate">
            {{ 'CELERY' | translate }}
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
  crustaceans = computed(() => this.dish()?.dish?.allergens?.includes('crustaceans'));
  eggs = computed(() => this.dish()?.dish?.allergens?.includes('eggs'));
  fish = computed(() => this.dish()?.dish?.allergens?.includes('fish'));
  soy = computed(() => this.dish()?.dish?.allergens?.includes('soy'));
  celery = computed(() => this.dish()?.dish?.allergens?.includes('celery'));
}
