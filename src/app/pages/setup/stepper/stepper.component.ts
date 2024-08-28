import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  template: `
    <div class="relative px-6 pb-20 pt-20 sm:pt-24 lg:static lg:px-8 lg:min-h-screen">
      <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
        <div
          class="absolute inset-y-0 left-0 -z-10 h-full w-full overflow-hidden bg-zinc-100 dark:bg-dark border-r border-zinc-900/10 dark:border-zinc-100/10 lg:w-1/2"
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
        @switch (step) { @case (1) {
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ 'CREATE_RESTAURANT' | translate }}
        </h2>
        <p class="mt-3 text-lg leading-8 text-zinc-600">
          {{ 'CREATE_RESTAURANT_DESCRIPTION' | translate }}
        </p>
        } @case (2) {
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ 'CONFIGURE_CHANNELS' | translate }}
        </h2>
        <p class="mt-3 text-lg leading-8 text-zinc-600">
          {{ 'CHECK_CHANNEL' | translate }}
        </p>
        } @case (3) {
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ 'CONFIGURE_COMPETITORS' | translate }}
        </h2>
        <p class="mt-3 text-lg leading-8 text-zinc-600">
          {{ 'CHECK_COMPETITOS' | translate }}
        </p>
        } @case (4) {
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ 'CONFIGURATION_COMPLETED' | translate }}
        </h2>
        <p class="mt-3 text-lg leading-8 text-zinc-600">
          {{ 'CONFIGURATION_COMPLETED_DESCRIPTION' | translate }}
        </p>
        } }

        <div class="py-12">
          <nav class="flex" aria-label="Progress">
            <ol role="list" class="space-y-6">
              <li>
                <a>
                  <span class="flex flex-row items-center">
                    @if (step > 1) {
                    <span class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <svg
                        class="h-full w-full text-accent dark:text-accentDark"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    } @if (step === 1) {
                    <span class="relative flex h-3 w-3 flex-shrink-0 items-center justify-center ml-1">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-accentDark opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-accent dark:bg-accentDark "></span>
                    </span>
                    } @if (step < 1) {
                    <div class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                      <div class="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    </div>
                    }
                    <span
                      class="ml-3 text-sm"
                      [ngClass]="{
                        'text-accent dark:text-accentDark font-semibold': step === 1,
                        'text-zinc-500 dark:text-zinc-400 font-medium': step !== 1
                      }"
                      >{{ 'INFO' | translate }}</span
                    >
                  </span>
                </a>
              </li>
              <li>
                <a class="flex items-start" aria-current="step">
                  <span class="flex flex-row items-center">
                    @if (step > 2) {
                    <span class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <svg
                        class="h-full w-full text-accent dark:text-accentDark"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    } @if (step === 2) {
                    <span class="relative flex h-3 w-3 flex-shrink-0 items-center justify-center ml-1">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-accentDark opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-accent dark:bg-accentDark "></span>
                    </span>
                    } @if (step < 2) {
                    <div class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                      <div class="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    </div>
                    }
                    <span
                      class="ml-3 text-sm text-zinc-500 dark:text-zinc-400"
                      [ngClass]="{
                        'text-accent dark:text-accentDark font-semibold': step === 2,
                        'text-zinc-500 dark:text-zinc-400 font-medium': step !== 2
                      }"
                      >{{ 'REVIEWS' | translate }}</span
                    >
                  </span>
                </a>
              </li>
              <li>
                <a>
                  <span class="flex flex-row items-center">
                    @if (step > 3) {
                    <span class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <svg
                        class="h-full w-full text-accent dark:text-accentDark"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    } @if (step === 3) {
                    <span class="relative flex h-3 w-3 flex-shrink-0 items-center justify-center ml-1">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent dark:bg-accentDark opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-accent dark:bg-accentDark "></span>
                    </span>
                    } @if (step < 3) {
                    <div class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                      <div class="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    </div>
                    }
                    <span
                      class="ml-3 text-sm text-zinc-500 dark:text-zinc-400"
                      [ngClass]="{
                        'text-accent dark:text-accentDark font-semibold': step === 3,
                        'text-zinc-500 dark:text-zinc-400 font-medium': step !== 3
                      }"
                      >{{ 'COMPETITORS' | translate }}</span
                    >
                  </span>
                </a>
              </li>
              <li>
                <a>
                  <span class="flex flex-row items-center">
                    @if (step > 4) {
                    <span class="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <svg
                        class="h-full w-full text-accent dark:text-accentDark"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    }
                  </span>
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <a
      class="hidden sm:block absolute cursor-pointer top-6 right-6 z-30 svg-icon-5 stroke-[1.8] rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition ease-in-out duration-200 animate-blurToClear200  transform"
      [routerLink]="['/structures']"
    >
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
    </a>
  `,
})
export class StepperComponent {
  step = +inject(ActivatedRoute).snapshot.url[0].path || 1;
}
