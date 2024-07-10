import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  template: `
    <div class="relative px-6 pb-20 pt-20 sm:pt-44 lg:static lg:px-8 lg:min-h-screen">
      <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
        <div
          class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-zinc-100 dark:bg-dark border-r border-zinc-900/10 dark:border-zinc-100/10 lg:w-1/2"
        >
          <svg
            class="absolute inset-0 h-full w-full stroke-zinc-200 dark:stroke-zinc-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:[mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                width="200"
                height="200"
                x="100%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M130 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" stroke-width="0" class="fill-white dark:fill-dark" />
            <svg x="100%" y="-1" class="overflow-visible fill-zinc-50 dark:fill-zinc-950">
              <path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
            </svg>
            <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
          </svg>
        </div>
        <div class="pb-12">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-normal">
            <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
              Eddy
              <span class="text-dark dark:text-white">.</span>
            </h1>
          </a>
        </div>
        <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ 'CREATE_RESTAURANT' | translate }}
        </h2>
        <p class="mt-6 text-lg leading-8 text-zinc-600">
          {{ 'CREATE_RESTAURANT_DESCRIPTION' | translate }}
        </p>
        <dl class="mt-10 space-y-4 text-base leading-7 ml-4">
          <ol class="relative text-zinc-500 dark:text-zinc-400 border-s border-zinc-200 dark:border-zinc-700">
            <li class="flex flex-row items-center mb-10 ms-6">
              <span
                class="absolute flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-dark rounded-full -start-4 ring-4 ring-transparent"
                [ngClass]="{ 'bg-green-300 dark:bg-green-400': step > 1 }"
              >
                <span
                  class="svg-icon svg-icon-5 stroke-[1.8]"
                  [ngClass]="{
                    'text-green-600 dark:text-green-50': step > 1,
                    'text-zinc-600 dark:text-zinc-400': step <= 1
                  }"
                >
                  @if (step > 1) {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>check</title>
                    <g fill="currentColor" class="nc-icon-wrapper">
                      <polyline
                        points="2.75 9.25 6.75 14.25 15.25 3.75"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                    </g>
                  </svg>
                  } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>id badge 2</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <circle cx="6.269" cy="7.519" r="1.269" stroke="none" fill="currentColor"></circle>
                      <path
                        d="M8.309,11.685c.368-.116,.562-.523,.406-.876-.415-.938-1.353-1.594-2.445-1.594s-2.03,.655-2.446,1.594c-.156,.353,.037,.76,.406,.876,.525,.165,1.219,.315,2.04,.315s1.515-.149,2.04-.315Z"
                        stroke="none"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M13,3.75h1.25c1.105,0,2,.895,2,2v6.5c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V5.75c0-1.105,.895-2,2-2h1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9,.75h0c.69,0,1.25,.56,1.25,1.25v2.25h-2.5V2c0-.69,.56-1.25,1.25-1.25Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <line
                        x1="10.5"
                        y1="7.75"
                        x2="13.25"
                        y2="7.75"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                      <line
                        x1="10.5"
                        y1="10.75"
                        x2="13.25"
                        y2="10.75"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                    </g>
                  </svg>
                  }
                </span>
              </span>
              <h3
                class="font-medium leading-tight"
                [ngClass]="{
                  'text-green-600 dark:text-green-50': step > 1,
                  'text-zinc-600 dark:text-zinc-400': step <= 1
                }"
              >
                {{ 'INFO' | translate }}
              </h3>
            </li>
            <li class="flex flex-row items-center mb-10 ms-6">
              <span
                class="absolute flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-dark rounded-full -start-4 ring-4 ring-transparent"
                [ngClass]="{ 'bg-green-300 dark:bg-green-400': step > 2 }"
              >
                <span
                  class="svg-icon svg-icon-5 stroke-[1.8]"
                  [ngClass]="{
                    'text-green-600 dark:text-green-50': step > 2,
                    'text-zinc-600 dark:text-zinc-400': step <= 2
                  }"
                >
                  @if (step > 2) {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>check</title>
                    <g fill="currentColor" class="nc-icon-wrapper">
                      <polyline
                        points="2.75 9.25 6.75 14.25 15.25 3.75"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                    </g>
                  </svg>
                  } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>star sparkle</title>
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <path
                        d="M4.743,2.492l-.946-.315-.316-.947c-.102-.306-.609-.306-.711,0l-.316,.947-.946,.315c-.153,.051-.257,.194-.257,.356s.104,.305,.257,.356l.946,.315,.316,.947c.051,.153,.194,.256,.355,.256s.305-.104,.355-.256l.316-.947,.946-.315c.153-.051,.257-.194,.257-.356s-.104-.305-.257-.356Z"
                        data-color="color-2"
                        data-stroke="none"
                        stroke="none"
                      ></path>
                      <polyline
                        points="13.469 9.728 16.25 7.017 11.24 6.29 9 1.75 6.76 6.29 1.75 7.017 5.375 10.551 4.519 15.54 8.864 13.256"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                      <path
                        d="M15.158,13.49l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z"
                        data-color="color-2"
                        data-stroke="none"
                        stroke="none"
                      ></path>
                      <circle
                        cx="14.25"
                        cy="3.25"
                        r=".75"
                        data-color="color-2"
                        data-stroke="none"
                        stroke="none"
                      ></circle>
                    </g>
                  </svg>
                  }
                </span>
              </span>
              <h3
                class="font-medium leading-tight"
                [ngClass]="{
                  'text-green-600 dark:text-green-50': step > 2,
                  'text-zinc-600 dark:text-zinc-400': step <= 2
                }"
              >
                {{ 'REVIEWS' | translate }}
              </h3>
            </li>
            <li class="flex flex-row items-center mb-10 ms-6">
              <span
                class="absolute flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-dark rounded-full -start-4 ring-4 ring-transparent"
                [ngClass]="{ 'bg-green-300 dark:bg-green-400': step > 3 }"
              >
                <span
                  class="svg-icon svg-icon-5 stroke-[1.8]"
                  [ngClass]="{
                    'text-green-600 dark:text-green-50': step > 3,
                    'text-zinc-600 dark:text-zinc-400': step <= 3
                  }"
                >
                  @if (step > 3) {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>check</title>
                    <g fill="currentColor" class="nc-icon-wrapper">
                      <polyline
                        points="2.75 9.25 6.75 14.25 15.25 3.75"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                    </g>
                  </svg>
                  } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>shield</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <path
                        d="M9.305,1.848l5.25,1.68c.414,.133,.695,.518,.695,.952v6.52c0,3.03-4.684,4.748-5.942,5.155-.203,.066-.413,.066-.616,0-1.258-.407-5.942-2.125-5.942-5.155V4.48c0-.435,.281-.82,.695-.952l5.25-1.68c.198-.063,.411-.063,.61,0Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                  }
                </span>
              </span>
              <h3
                class="font-medium leading-tight"
                [ngClass]="{
                  'text-green-600 dark:text-green-50': step > 3,
                  'text-zinc-600 dark:text-zinc-400': step <= 3
                }"
              >
                {{ 'COMPETITORS' | translate }}
              </h3>
            </li>
            <li class="flex flex-row items-center mb-10 ms-6">
              <span
                class="absolute flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-dark rounded-full -start-4 ring-4 ring-transparent"
              >
                <span class="svg-icon svg-icon-5 stroke-[1.8] text-zinc-600 dark:text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>party</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <path
                        d="M2.795,13.957L5.568,4.846c.22-.722,1.13-.95,1.664-.416l6.339,6.339c.534,.534,.306,1.444-.416,1.664l-9.112,2.773c-.765,.233-1.481-.482-1.248-1.248Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <line
                        x1="6.825"
                        y1="14.359"
                        x2="4.654"
                        y2="7.848"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                      <line
                        x1="10.346"
                        y1="13.287"
                        x2="7.475"
                        y2="4.673"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                      <path
                        d="M16.743,2.492l-.946-.315-.316-.947c-.102-.306-.609-.306-.711,0l-.316,.947-.946,.315c-.153,.051-.257,.194-.257,.356s.104,.305,.257,.356l.946,.315,.316,.947c.051,.153,.194,.256,.355,.256s.305-.104,.355-.256l.316-.947,.946-.315c.153-.051,.257-.194,.257-.356s-.104-.305-.257-.356Z"
                        stroke="none"
                        fill="currentColor"
                      ></path>
                      <circle cx="12.75" cy="5.25" r=".75" stroke="none" fill="currentColor"></circle>
                      <path
                        d="M10,3.439c.184-.133,.588-.465,.823-1.048,.307-.763,.118-1.442,.055-1.64"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M14.561,8c.133-.184,.465-.588,1.048-.823,.763-.307,1.442-.118,1.64-.055"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </span>
              </span>
              <h3 class="font-medium leading-tight text-zinc-600 dark:text-zinc-400">{{ 'DONE' | translate }}!</h3>
            </li>
          </ol>
        </dl>
        <a
          class="flex flex-row items-center gap-x-1 font-medium mt-10 text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
          [routerLink]="['/structures']"
        >
          <span class="svg-icon-7 text-zinc-600 dark:text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              width="18"
              viewBox="0 0 18 18"
              class="h-5 w-5 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
            >
              <title>chevron left</title>
              <g fill="currentColor" class="nc-icon-wrapper">
                <polyline
                  points="11.5 15.25 5.25 9 11.5 2.75"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></polyline>
              </g>
            </svg>
          </span>

          {{ 'CHOOSE_RESTAURANT' | translate }}</a
        >
      </div>
    </div>
  `,
})
export class StepperComponent {
  step = +inject(ActivatedRoute).snapshot.url[0].path || 1;
}
