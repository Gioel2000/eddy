import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'step2-thefork',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      class="pointer-events-none relative bg-white dark:bg-zinc-700 border-t border-zinc-200 dark:border-zinc-700 -mb-8 w-full h-[32rem] rounded-b-xl"
    >
      <div
        class="flex flex-row items-center justify-between gap-x-2 p-5 mb-5 border-b border-zinc-200 dark:border-zinc-700"
      >
        <div>
          <svg
            version="1.1"
            id="katman_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 841.89 595.28"
            style="enable-background:new 0 0 841.89 595.28;"
            xml:space="preserve"
            height="80"
            class="relative -left-4 -top-6 -mb-12"
          >
            <style type="text/css">
              .st0 {
                fill: #00665c;
              }
              .st1 {
                fill-rule: evenodd;
                clip-rule: evenodd;
                fill: #00665c;
              }
              .dark .st0 {
                fill: #019486;
              }
              .dark .st1 {
                fill-rule: evenodd;
                clip-rule: evenodd;
                fill: #019486;
              }
            </style>
            <g>
              <path class="st0" d="M74.35,264h32.03v79.09h18.16V264h32.15v-13.62H74.35V264z" />
              <path
                class="st0"
                d="M182.55,250.43h-17.67v92.67h17.67v-33.87c0-16.69,11.41-26.88,21.72-26.88c7,0,12.15,4.54,12.15,13.74v47
                      h17.67v-52.65c0-14.97-9.94-22.21-21.72-22.21c-12.15,0-24.91,8.1-29.82,23.07V250.43z"
              />
              <path
                class="st1"
                d="M242.72,305.79c0-18.78,12.03-37.55,36.32-37.55c19.64,0,30.07,11.9,30.07,34.24v3.44h-51.54
                    c1.96,11.66,10.92,20.86,26.02,20.86c9.08,0,18.78-3.31,26.75-9.69v17.3c-9.08,6.75-19.39,10.06-29.58,10.06
                    C256.96,344.44,242.72,326.9,242.72,305.79z M291.19,297.32c0-12.39-5.03-18.53-14.48-18.53c-11.29,0-17.92,8.59-19.27,18.53
                    H291.19z"
              />
              <path class="st0" d="M385.25,250.38h-65.9v92.71h18.29v-42.52h41.48v-13.62h-41.48V264h47.61V250.38z" />
              <path
                class="st1"
                d="M386.9,306.52c0-19.02,13.62-38.29,39.88-38.29c25.77,0,39.15,18.9,39.15,37.92
                    c0,19.14-13.62,38.29-39.88,38.29C400.4,344.44,386.9,325.42,386.9,306.52z M427.28,330.82c13.5,0,20.62-10.8,20.62-23.56
                    c0-13.38-7.73-25.4-22.33-25.4c-13.5,0-20.62,10.8-20.62,23.44C404.94,318.8,412.67,330.82,427.28,330.82z"
              />
              <path
                class="st0"
                d="M490.88,269.46h-16.32v73.63h17.67v-44.42c3.68-9.08,12.39-13.99,21.35-13.99c4.79,0,9.82,1.35,13.62,4.05
                    v-17.3c-2.95-1.84-6.75-2.94-10.55-2.94c-11.04,0-21.84,6.99-25.77,23.68V269.46z"
              />
              <path
                class="st0"
                d="M569.43,299.19l35.04-37.31h-20.04l-30.55,31.51l-0.01-43.01h-17.66v92.71H554l-0.13-37.81
                      c0,0,29.28-0.72,29.28,37.81h19.15C602.31,305.79,569.43,299.19,569.43,299.19z"
              />
            </g>
            <path
              class="st0"
              d="M619.8,298.04c0.04-34.31,25.25-68.83,74.87-68.83c48.33,0,73.49,34.91,72.93,67.97
                  c-0.66,38.32-26.2,58.15-49.08,65.27l-2.61-11.43c-1.36-5.99,0.26-11.33,4.5-15.11c5.47-4.88,8.74-10.92,10.43-19.27
                  c1.79-8.83,0.95-18.52-3.03-28.2l-13.53-38.06h-13.58l10.85,43.48c0.99,4.33-2.3,8.46-6.74,8.46l-13.18-57.81h-12.34l11.87,71.35
                  c-7.43,0.67-10.19-4.15-10.8-7.64l-7.57-53.88h-12.54c0,0,0.08,29.03,0.08,48.85c0,29.14,15.57,37.81,26.33,40.4
                  c6.08,1.46,10.15,6.19,11.25,12.84l1.53,9.18C676.39,365.66,619.73,357.08,619.8,298.04z"
            />
          </svg>
        </div>
        <div
          class="flex flex-row items-center justify-between shadow-sm rounded-xl ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 gap-x-2 p-1.5"
        >
          <span class="svg-icon svg-icon svg-icon-5 stroke-[1.4] text-zinc-800 dark:text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18" class="ml-0.5">
              <title>magnifier</title>
              <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                <line
                  x1="15.25"
                  y1="15.25"
                  x2="11.285"
                  y2="11.285"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-color="color-2"
                ></line>
                <circle
                  cx="7.75"
                  cy="7.75"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></circle>
              </g>
            </svg>
          </span>
          <span
            class="w-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm leading-6 mr-5"
            >{{ 'RESTAURANT' | translate }}...</span
          >
          <button
            type="button"
            class="rounded-lg bg-[#02665c] dark:bg-[#019486] px-2.5 py-1 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {{ 'SEARCH' | translate }}
          </button>
        </div>
        <div class="flex flex-row items-center gap-x-1.5">
          <div class="svg-icon-4 stroke-[1.6]">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
              <title>circle user</title>
              <g fill="none" class="fill-[#02665c] dark:fill-[#019486]" class="nc-icon-wrapper">
                <circle
                  cx="9"
                  cy="7.75"
                  r="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="stroke-[#02665c] dark:stroke-[#019486]"
                ></circle>
                <path
                  d="M5.154,15.147c.479-1.673,2.019-2.897,3.846-2.897s3.367,1.224,3.846,2.897"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="stroke-[#02665c] dark:stroke-[#019486]"
                ></path>
                <circle
                  class="stroke-[#02665c] dark:stroke-[#019486]"
                  cx="9"
                  cy="9"
                  r="7.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></circle>
              </g>
            </svg>
          </div>
          <span class="text-[#02665c] dark:text-[#019486] text-sm font-semibold uppercase">{{
            'LOG_IN' | translate
          }}</span>
        </div>
      </div>
      <img [src]="image()" alt="Tripadvisor" class="h-44 w-full object-cover" />
      <div class="px-5">
        <div class="flex flex-col gap-2 py-6">
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {{ name() }}
          </h3>
          <span class="text-sm font-normal text-zinc-400 dark:text-zinc-500">
            {{ address() }}
          </span>
        </div>
        <div class="block">
          <div class="border-b border-zinc-200 dark:border-zinc-600">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                class="whitespace-nowrap border-b-2 border-[#02665c] dark:border-[#019486] px-1 py-2 text-sm font-semibold text-[#02665c] dark:text-[#019486]"
                >{{ 'INFO' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400"
                >{{ 'MENU' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400"
                >{{ 'REVIEWS' | translate }}</a
              >
            </nav>
          </div>
        </div>
        <div class="flex flex-col gap-2 py-6">
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {{ 'MENU_OF_THE_RESTAURANT' | translate }}
          </h3>
        </div>
      </div>
    </div>
  `,
})
export class TheForkStep2Component {
  image = input.required<string>();
  name = input.required<string>();
  address = input.required<string>();
}
