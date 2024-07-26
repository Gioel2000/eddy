import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EditChannelDialogService } from './edit-channel-dialog.service';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'edit-channel-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, ReactiveFormsModule],
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
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
                (click)="dialog.closeDialog()"
              >
                <span class="svg-icon svg-icon-8 stroke-[1.6]">
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
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                @switch (dialog.source()) { @case('google') {
                <div class="pb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="50"
                    class="relative -left-4"
                    viewBox="-40.446 -22.19 350.532 133.14"
                  >
                    <path
                      d="M115.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                      fill="#EA4335"
                    />
                    <path
                      d="M163.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M209.39 25.87v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
                      fill="#4285F4"
                    />
                    <path d="M224.64 2.53v65h-9.5v-65z" fill="#34A853" />
                    <path
                      d="M261.66 54.01l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
                      fill="#EA4335"
                    />
                    <path
                      d="M34.93 40.94v-9.41h31.71c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C15.96 68.88 0 53.42 0 34.44 0 15.46 15.96 0 34.94 0c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65z"
                      fill="#4285F4"
                    />
                  </svg>
                </div>
                } @case ('tripadvisor') {
                <div class="pb-[39px]">
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 3354.111 713.496"
                    enable-background="new 0 0 3354.111 713.496"
                    xml:space="preserve"
                    height="35"
                  >
                    <g>
                      <path
                        class="fill-zinc-900 dark:fill-zinc-200 text-zinc-900 dark:text-zinc-200"
                        d="M3335.258,476.767c-10.404,0-18.854,8.45-18.854,18.854c0,10.404,8.449,18.854,18.854,18.854   c10.402,0,18.854-8.45,18.854-18.854C3354.111,485.217,3345.66,476.767,3335.258,476.767z M3335.258,511.485   c-8.77,0-15.865-7.136-15.865-15.864c0-8.77,7.135-15.864,15.865-15.864c8.77,0,15.904,7.135,15.904,15.864   C3351.162,504.35,3344.027,511.485,3335.258,511.485z M3341.396,492.392c0-3.428-2.432-5.461-6.02-5.461h-6.02v17.18h2.949v-6.218   h3.229l3.109,6.218h3.189l-3.428-6.855C3340.24,496.418,3341.396,494.743,3341.396,492.392z M3335.258,495.222h-2.91v-5.699h2.91   c1.992,0,3.188,0.996,3.188,2.83C3338.445,494.226,3337.211,495.222,3335.258,495.222z M1063.508,285.956v-45.6h-69.914v271.288   h69.914V348.976c0-29.457,18.894-43.927,48.351-43.927h38.266v-64.692h-32.686C1091.849,240.356,1069.607,253.709,1063.508,285.956   z M1215.615,133.053c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C1257.866,151.946,1239.531,133.053,1215.615,133.053z M1180.737,511.645h69.756V240.356h-69.756V511.645z M1582.766,376   c0,77.448-62.779,140.229-140.228,140.229c-31.251,0-59.591-10.244-82.312-27.544v102.601h-69.755V240.356h69.755v22.959   c22.721-17.299,51.061-27.543,82.312-27.543C1519.987,235.772,1582.766,298.552,1582.766,376z M1512.573,376   c0-42.052-34.12-76.173-76.173-76.173s-76.173,34.121-76.173,76.173c0,42.053,34.121,76.173,76.173,76.173   C1478.453,452.173,1512.573,418.093,1512.573,376z M2795.152,352.204l-40.697-11.161c-26.785-6.976-37.189-15.187-37.189-29.337   c0-13.792,14.668-23.438,35.635-23.438c19.971,0,35.635,13.074,35.635,29.815v1.554h64.295v-1.554   c0-49.228-40.139-82.312-99.93-82.312c-59.191,0-102.201,33.044-102.201,78.604c0,35.436,23.477,62.142,64.453,73.223   l38.984,10.643c29.615,8.211,40.617,17.3,40.617,33.603c0,17.18-15.904,28.739-39.582,28.739   c-24.674,0-41.295-15.626-41.295-38.824v-1.555h-68.24v1.555c0,55.645,44.803,94.548,108.979,94.548   c61.822,0,106.705-37.986,106.705-90.283C2861.32,400.354,2849.84,366.793,2795.152,352.204z M1830.219,240.356h69.754v271.288   h-69.754v-22.96c-22.721,17.3-51.062,27.544-82.312,27.544c-77.447,0-140.227-62.78-140.227-140.229s62.78-140.228,140.227-140.228   c31.25,0,59.592,10.244,82.312,27.543V240.356z M1830.219,376L1830.219,376c0-42.092-34.121-76.173-76.174-76.173   s-76.172,34.121-76.172,76.173c0,42.053,34.119,76.173,76.172,76.173C1796.137,452.173,1830.219,418.093,1830.219,376z    M2151.85,143.815h69.756v367.869h-69.756v-22.96c-22.721,17.3-51.061,27.544-82.311,27.544   c-77.449,0-140.229-62.78-140.229-140.229s62.779-140.228,140.229-140.228c31.25,0,59.59,10.244,82.311,27.543V143.815z    M2151.85,376c0-42.052-34.121-76.173-76.174-76.173c-42.051,0-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C2117.729,452.173,2151.85,418.093,2151.85,376z M2545.469,511.645h69.754V240.356h-69.754V511.645z M2580.346,133.053   c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C2622.598,151.946,2604.262,133.053,2580.346,133.053z M3162.822,376c0,77.448-62.779,140.229-140.229,140.229   c-77.447,0-140.227-62.78-140.227-140.229s62.779-140.228,140.227-140.228C3100.043,235.772,3162.822,298.552,3162.822,376z    M3098.768,376c0-42.052-34.121-76.173-76.174-76.173s-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C3064.646,452.173,3098.768,418.093,3098.768,376z M1027.793,143.815H760.212v62.222h99.053v305.607h69.516V206.037h99.053v-62.222   H1027.793z M2381.006,437.345l-62.062-196.988h-73.264l93.074,271.288h83.945l93.631-271.288h-73.264L2381.006,437.345z    M3265.023,285.956v-45.6h-69.914v271.288h69.914V348.976c0-29.457,18.895-43.927,48.35-43.927h38.266v-64.692h-32.684   C3293.363,240.356,3271.162,253.709,3265.023,285.956z"
                      />
                      <circle fill="#34E0A1" cx="356.749" cy="356.748" r="356.748" />
                      <path
                        d="M577.095,287.152l43.049-46.836h-95.465c-47.792-32.646-105.51-51.659-167.931-51.659   c-62.342,0-119.899,19.054-167.612,51.659H93.432l43.049,46.836c-26.387,24.075-42.929,58.754-42.929,97.259   c0,72.665,58.914,131.578,131.579,131.578c34.519,0,65.968-13.313,89.446-35.077l42.172,45.919l42.172-45.879   c23.478,21.764,54.887,35.037,89.406,35.037c72.665,0,131.658-58.913,131.658-131.578   C620.024,345.866,603.483,311.188,577.095,287.152z M225.17,473.458c-49.188,0-89.047-39.859-89.047-89.047   s39.86-89.048,89.047-89.048c49.187,0,89.047,39.86,89.047,89.048S274.357,473.458,225.17,473.458z M356.788,381.82   c0-58.595-42.61-108.898-98.853-130.383c30.413-12.716,63.776-19.771,98.813-19.771s68.439,7.055,98.853,19.771   C399.399,272.962,356.788,323.226,356.788,381.82z M488.367,473.458c-49.188,0-89.048-39.859-89.048-89.047   s39.86-89.048,89.048-89.048s89.047,39.86,89.047,89.048S537.554,473.458,488.367,473.458z M488.367,337.694   c-25.79,0-46.677,20.887-46.677,46.677c0,25.789,20.887,46.676,46.677,46.676c25.789,0,46.676-20.887,46.676-46.676   C535.042,358.621,514.156,337.694,488.367,337.694z M271.846,384.411c0,25.789-20.887,46.676-46.676,46.676   s-46.676-20.887-46.676-46.676c0-25.79,20.887-46.677,46.676-46.677C250.959,337.694,271.846,358.621,271.846,384.411z"
                      />
                    </g>
                  </svg>
                </div>
                } @case ('thefork') {
                <svg
                  version="1.1"
                  id="katman_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 841.89 595.28"
                  style="enable-background:new 0 0 841.89 595.28;"
                  xml:space="preserve"
                  height="122"
                  class="relative -left-4 -top-12 -mb-12"
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
                    <path
                      class="st0"
                      d="M385.25,250.38h-65.9v92.71h18.29v-42.52h41.48v-13.62h-41.48V264h47.61V250.38z"
                    />
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
                } }
                <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100 w-full" id="modal-title">
                  {{ 'EDIT_CHANNEL' | translate }}
                </h3>
                <div class="mt-2 w-full">
                  <p class="text-sm text-zinc-500">{{ 'EDIT_CHANNEL_DESCRIPTION' | translate }}</p>
                </div>
                <input
                  type="text"
                  name="first-name"
                  id="dish-name"
                  autocomplete="given-name"
                  class="block w-full mt-5 rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                  [placeholder]="dialog.placeholder()"
                  [formControl]="URLFormControl"
                />
              </div>
            </div>
            <div class="mt-8 sm:flex gap-x-3">
              <button
                id="yes"
                class="flex flex-col items-center justify-center w-full cursor-pointer rounded-[10px] min-w-11 bg-accent dark:bg-accentDark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 dark:hover:hover:bg-accentDark/90 sm:mt-0 sm:w-auto disabled:opacity-30"
                (click)="save()"
                [disabled]="URLFormControl.invalid"
              >
                <span class="font-semibold text-base">
                  {{ 'SAVE' | translate }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EditChannelDialogComponent {
  dialog = inject(EditChannelDialogService);

  readonly URL_REGEX = /^https:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*$/;
  readonly URLFormControl = new FormControl('', [Validators.pattern(this.URL_REGEX)]);

  constructor() {
    toObservable(this.dialog.url)
      .pipe(untilDestroyed(this))
      .subscribe((url) => this.URLFormControl.patchValue(url));
  }

  save() {
    this.dialog.fuction()(this.URLFormControl.value as string);
    this.dialog.closeDialog();
  }
}
