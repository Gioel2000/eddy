import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'step2-tripadvisor',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      class="pointer-events-none relative bg-white dark:bg-zinc-700 border-t border-zinc-200 dark:border-zinc-700 -mb-8 w-full h-[32rem] rounded-b-xl"
    >
      <div class="flex flex-row items-center justify-between gap-x-2 p-5">
        <div>
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
            height="25"
          >
            <g>
              <path
                class="fill-zinc-900 dark:fill-zinc-100 text-zinc-900"
                d="M3335.258,476.767c-10.404,0-18.854,8.45-18.854,18.854c0,10.404,8.449,18.854,18.854,18.854   c10.402,0,18.854-8.45,18.854-18.854C3354.111,485.217,3345.66,476.767,3335.258,476.767z M3335.258,511.485   c-8.77,0-15.865-7.136-15.865-15.864c0-8.77,7.135-15.864,15.865-15.864c8.77,0,15.904,7.135,15.904,15.864   C3351.162,504.35,3344.027,511.485,3335.258,511.485z M3341.396,492.392c0-3.428-2.432-5.461-6.02-5.461h-6.02v17.18h2.949v-6.218   h3.229l3.109,6.218h3.189l-3.428-6.855C3340.24,496.418,3341.396,494.743,3341.396,492.392z M3335.258,495.222h-2.91v-5.699h2.91   c1.992,0,3.188,0.996,3.188,2.83C3338.445,494.226,3337.211,495.222,3335.258,495.222z M1063.508,285.956v-45.6h-69.914v271.288   h69.914V348.976c0-29.457,18.894-43.927,48.351-43.927h38.266v-64.692h-32.686C1091.849,240.356,1069.607,253.709,1063.508,285.956   z M1215.615,133.053c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C1257.866,151.946,1239.531,133.053,1215.615,133.053z M1180.737,511.645h69.756V240.356h-69.756V511.645z M1582.766,376   c0,77.448-62.779,140.229-140.228,140.229c-31.251,0-59.591-10.244-82.312-27.544v102.601h-69.755V240.356h69.755v22.959   c22.721-17.299,51.061-27.543,82.312-27.543C1519.987,235.772,1582.766,298.552,1582.766,376z M1512.573,376   c0-42.052-34.12-76.173-76.173-76.173s-76.173,34.121-76.173,76.173c0,42.053,34.121,76.173,76.173,76.173   C1478.453,452.173,1512.573,418.093,1512.573,376z M2795.152,352.204l-40.697-11.161c-26.785-6.976-37.189-15.187-37.189-29.337   c0-13.792,14.668-23.438,35.635-23.438c19.971,0,35.635,13.074,35.635,29.815v1.554h64.295v-1.554   c0-49.228-40.139-82.312-99.93-82.312c-59.191,0-102.201,33.044-102.201,78.604c0,35.436,23.477,62.142,64.453,73.223   l38.984,10.643c29.615,8.211,40.617,17.3,40.617,33.603c0,17.18-15.904,28.739-39.582,28.739   c-24.674,0-41.295-15.626-41.295-38.824v-1.555h-68.24v1.555c0,55.645,44.803,94.548,108.979,94.548   c61.822,0,106.705-37.986,106.705-90.283C2861.32,400.354,2849.84,366.793,2795.152,352.204z M1830.219,240.356h69.754v271.288   h-69.754v-22.96c-22.721,17.3-51.062,27.544-82.312,27.544c-77.447,0-140.227-62.78-140.227-140.229s62.78-140.228,140.227-140.228   c31.25,0,59.592,10.244,82.312,27.543V240.356z M1830.219,376L1830.219,376c0-42.092-34.121-76.173-76.174-76.173   s-76.172,34.121-76.172,76.173c0,42.053,34.119,76.173,76.172,76.173C1796.137,452.173,1830.219,418.093,1830.219,376z    M2151.85,143.815h69.756v367.869h-69.756v-22.96c-22.721,17.3-51.061,27.544-82.311,27.544   c-77.449,0-140.229-62.78-140.229-140.229s62.779-140.228,140.229-140.228c31.25,0,59.59,10.244,82.311,27.543V143.815z    M2151.85,376c0-42.052-34.121-76.173-76.174-76.173c-42.051,0-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C2117.729,452.173,2151.85,418.093,2151.85,376z M2545.469,511.645h69.754V240.356h-69.754V511.645z M2580.346,133.053   c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C2622.598,151.946,2604.262,133.053,2580.346,133.053z M3162.822,376c0,77.448-62.779,140.229-140.229,140.229   c-77.447,0-140.227-62.78-140.227-140.229s62.779-140.228,140.227-140.228C3100.043,235.772,3162.822,298.552,3162.822,376z    M3098.768,376c0-42.052-34.121-76.173-76.174-76.173s-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C3064.646,452.173,3098.768,418.093,3098.768,376z M1027.793,143.815H760.212v62.222h99.053v305.607h69.516V206.037h99.053v-62.222   H1027.793z M2381.006,437.345l-62.062-196.988h-73.264l93.074,271.288h83.945l93.631-271.288h-73.264L2381.006,437.345z    M3265.023,285.956v-45.6h-69.914v271.288h69.914V348.976c0-29.457,18.895-43.927,48.35-43.927h38.266v-64.692h-32.684   C3293.363,240.356,3271.162,253.709,3265.023,285.956z"
              />
              <circle fill="#34E0A1" cx="356.749" cy="356.748" r="356.748" />
              <path
                d="M577.095,287.152l43.049-46.836h-95.465c-47.792-32.646-105.51-51.659-167.931-51.659   c-62.342,0-119.899,19.054-167.612,51.659H93.432l43.049,46.836c-26.387,24.075-42.929,58.754-42.929,97.259   c0,72.665,58.914,131.578,131.579,131.578c34.519,0,65.968-13.313,89.446-35.077l42.172,45.919l42.172-45.879   c23.478,21.764,54.887,35.037,89.406,35.037c72.665,0,131.658-58.913,131.658-131.578   C620.024,345.866,603.483,311.188,577.095,287.152z M225.17,473.458c-49.188,0-89.047-39.859-89.047-89.047   s39.86-89.048,89.047-89.048c49.187,0,89.047,39.86,89.047,89.048S274.357,473.458,225.17,473.458z M356.788,381.82   c0-58.595-42.61-108.898-98.853-130.383c30.413-12.716,63.776-19.771,98.813-19.771s68.439,7.055,98.853,19.771   C399.399,272.962,356.788,323.226,356.788,381.82z M488.367,473.458c-49.188,0-89.048-39.859-89.048-89.047   s39.86-89.048,89.048-89.048s89.047,39.86,89.047,89.048S537.554,473.458,488.367,473.458z M488.367,337.694   c-25.79,0-46.677,20.887-46.677,46.677c0,25.789,20.887,46.676,46.677,46.676c25.789,0,46.676-20.887,46.676-46.676   C535.042,358.621,514.156,337.694,488.367,337.694z M271.846,384.411c0,25.789-20.887,46.676-46.676,46.676   s-46.676-20.887-46.676-46.676c0-25.79,20.887-46.677,46.676-46.677C250.959,337.694,271.846,358.621,271.846,384.411z"
              />
            </g>
          </svg>
        </div>
        <div class="relative rounded-full shadow-sm dark:bg-zinc-800">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="svg-icon svg-icon svg-icon-5 stroke-[1.4] text-zinc-800 dark:text-zinc-200">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
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
          </div>
          <input
            #searchControl
            type="text"
            class="block w-full rounded-full border-0 py-1.5 pl-10 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent text-sm leading-6"
            placeholder="{{ 'SEARCH' | translate }}..."
          />
        </div>
        <button
          type="button"
          class="rounded-full bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {{ 'SIGNIN' | translate }}
        </button>
      </div>
      <div class="px-5">
        <div class="block">
          <div class="border-b border-zinc-200 dark:border-zinc-600">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                class="whitespace-nowrap border-b-2 border-zinc-900 dark:border-zinc-100 px-1 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                >{{ 'RESTAURANTS' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                >{{ 'HOTEL' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                >{{ 'FLIGHTS' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                >{{ 'HOLIDAY_HOMES' | translate }}</a
              >
            </nav>
          </div>
        </div>
        <div class="flex flex-col gap-2 py-6">
          <h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {{ name() }}
          </h3>
          <span class="text-sm font-normal text-zinc-400 dark:text-zinc-500">
            {{ address() }}
          </span>
        </div>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-600 h-[calc(32rem_-_219px)] w-full p-5 rounded-b-xl">
        <!-- <div
          class="flex flex-col justify-between gap-3 col-span-2 rounded-lg h-64 ring-1 ring-inset ring-zinc-200 bg-white p-3"
        >
          <div class="flex flex-col gap-3 col-span-2">
            <h3 class="text-sm font-semibold text-zinc-900">
              {{ 'BOOK_A_TABLE' | translate }}
            </h3>
            <button
              type="button"
              class="flex flex-row items-center gap-2 rounded-full w-fit bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div class="svg-icon-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                  <title>calendar</title>
                  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" stroke="#000">
                    <line x1="1.25" y1="4.75" x2="10.75" y2="4.75"></line>
                    <rect x="1.25" y="1.75" width="9.5" height="9.5" rx="2" ry="2"></rect>
                    <circle cx="4" cy="7.5" r="1" stroke-width="1"></circle>
                    <line x1="3.75" y1=".75" x2="3.75" y2="1.75"></line>
                    <line x1="8.25" y1=".75" x2="8.25" y2="1.75"></line>
                  </g>
                </svg>
              </div>
              <span>{{ today() }}</span>
            </button>

            <button
              type="button"
              class="flex flex-row items-center gap-2 rounded-full w-fit bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div class="svg-icon-7">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18" stroke-width="1.5">
                  <title>clock</title>
                  <g fill="none" stroke="currentColor" class="nc-icon-wrapper" stroke-width="1.5">
                    <circle
                      cx="9"
                      cy="9"
                      r="7.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                    ></circle>
                    <polyline
                      stroke-width="1.5"
                      points="9 4.75 9 9 12.25 11.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke="currentColor"
                    ></polyline>
                  </g>
                </svg>
              </div>
              <span>{{ time() }}</span>
            </button>

            <button
              type="button"
              class="flex flex-row items-center gap-2 rounded-full w-fit bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div class="svg-icon-7">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>users</title>
                  <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper" stroke-width="1.5">
                    <circle
                      cx="5.75"
                      cy="6.25"
                      r="2"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></circle>
                    <path
                      d="M9.609,15.122c.523-.175,.83-.744,.636-1.259-.685-1.818-2.436-3.112-4.494-3.112s-3.809,1.294-4.494,3.112c-.194,.516,.113,1.085,.636,1.259,.962,.321,2.281,.628,3.859,.628s2.897-.307,3.858-.628Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <circle
                      cx="12"
                      cy="3.75"
                      r="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></circle>
                    <path
                      d="M12.749,13.227c1.248-.077,2.304-.336,3.109-.605,.523-.175,.83-.744,.636-1.259-.685-1.818-2.436-3.112-4.494-3.112-.977,0-1.885,.292-2.643,.793"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></path>
                  </g>
                </svg>
              </div>
              <span>2</span>
            </button>
          </div>
          <button
            type="button"
            class="rounded-full bg-[#f1b302] px-3.5 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {{ 'ORDER_ONLINE' | translate }}
          </button>
        </div> -->
        <img [src]="image()" alt="Tripadvisor" class="rounded-lg h-64 w-full object-cover object-center" />
      </div>
    </div>
  `,
})
export class TripadvisorStep2Component {
  image = input.required<string>();
  name = input.required<string>();
  address = input.required<string>();

  // i18n = inject(I18nStore);

  // today = signal('');
  // time = signal('');

  // constructor() {
  //   toObservable(this.i18n.selectedLang)
  //     .pipe(untilDestroyed(this))
  //     .subscribe(({ locale }) => {
  //       this.today.set(moment().locale(locale).format('ddd D MMM'));
  //       this.time.set(moment().locale(locale).format('LT'));
  //     });
  // }
}
