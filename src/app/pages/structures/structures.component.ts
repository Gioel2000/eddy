import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SettingsService } from '../../ui/settings/settings.service';
import { SettingsComponent } from '../../ui/settings/settings.component';

@Component({
  standalone: true,
  imports: [TranslateModule, InlineSVGModule, SettingsComponent],
  template: `
    @defer (on viewport; prefetch on idle) {
    <settings></settings>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    }

    <div class="bg-zinc-50 dark:bg-zinc-900 py-12 sm:py-24 h-min-screen">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="pb-12">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-bold">
            <h1 class="text-accent -tracking-[0.05rem]">
              Eddy
              <span class="text-dark dark:text-white">.</span>
            </h1>
          </a>
        </div>
        <div class="mx-auto text-start">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {{ 'CHOOSE_RESTAURANT' | translate }}
          </h2>
          <p class="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {{ 'CHOOSE_RESTAURANT_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 shadow-sm shadow-black/10"
          >
            <div class="relative w-full">
              <img
                src="https://media.cntraveler.com/photos/5aba59a1f75ed97616cf1816/master/pass/Osteria-Chiana_Susan-Wright_2018__DSC1732.jpg"
                alt=""
                class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
            </div>
            <div class="w-full max-w-xl p-6">
              <div class="flex items-center gap-x-4 text-xs">
                <span class="text-zinc-500">Via Toledo 14, Roma</span>
              </div>
              <div class="group relative">
                <h3
                  class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
                >
                  <a>
                    <span class="absolute inset-0"></span>
                    Osteria Chiana Susan Wright
                  </a>
                </h3>

                <div class="flex flex-col mt-5 gap-y-2">
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ 'ristorante@icloud.com' }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">+39 349 087 4007</div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">http://sito.it</div>
                </div>
              </div>
              <div class="relative mt-8 flex items-center gap-x-4">
                <div
                  class="flex flex-row items-center justify-center col-span-1 rounded-lg p-3 w-full cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </div>
              </div>
            </div>
          </article>

          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 shadow-sm shadow-black/10"
          >
            <div class="relative w-full">
              <img
                src="https://media.cntraveler.com/photos/5aba59a1f75ed97616cf1816/master/pass/Osteria-Chiana_Susan-Wright_2018__DSC1732.jpg"
                alt=""
                class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
            </div>
            <div class="w-full max-w-xl p-6">
              <div class="flex items-center gap-x-4 text-xs">
                <span class="text-zinc-500">Via Toledo 14, Roma</span>
              </div>
              <div class="group relative">
                <h3
                  class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
                >
                  <a>
                    <span class="absolute inset-0"></span>
                    Osteria Chiana Susan Wright
                  </a>
                </h3>

                <div class="flex flex-col mt-5 gap-y-2">
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ 'ristorante@icloud.com' }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">+39 349 087 4007</div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">http://sito.it</div>
                </div>
              </div>
              <div class="relative mt-8 flex items-center gap-x-4">
                <div
                  class="flex flex-row items-center justify-center col-span-1 rounded-lg p-3 w-full cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </div>
              </div>
            </div>
          </article>

          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 shadow-sm shadow-black/10"
          >
            <div class="relative w-full">
              <img
                src="https://media.cntraveler.com/photos/5aba59a1f75ed97616cf1816/master/pass/Osteria-Chiana_Susan-Wright_2018__DSC1732.jpg"
                alt=""
                class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
            </div>
            <div class="w-full max-w-xl p-6">
              <div class="flex items-center gap-x-4 text-xs">
                <span class="text-zinc-500">Via Toledo 14, Roma</span>
              </div>
              <div class="group relative">
                <h3
                  class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
                >
                  <a>
                    <span class="absolute inset-0"></span>
                    Osteria Chiana Susan Wright
                  </a>
                </h3>

                <div class="flex flex-col mt-5 gap-y-2">
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ 'ristorante@icloud.com' }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">+39 349 087 4007</div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">http://sito.it</div>
                </div>
              </div>
              <div class="relative mt-8 flex items-center gap-x-4">
                <div
                  class="flex flex-row items-center justify-center col-span-1 rounded-lg p-3 w-full cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </div>
              </div>
            </div>
          </article>

          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 shadow-sm shadow-black/10"
          >
            <div class="relative w-full">
              <img
                src="https://media.cntraveler.com/photos/5aba59a1f75ed97616cf1816/master/pass/Osteria-Chiana_Susan-Wright_2018__DSC1732.jpg"
                alt=""
                class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
            </div>
            <div class="w-full max-w-xl p-6">
              <div class="flex items-center gap-x-4 text-xs">
                <span class="text-zinc-500">Via Toledo 14, Roma</span>
              </div>
              <div class="group relative">
                <h3
                  class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"
                >
                  <a>
                    <span class="absolute inset-0"></span>
                    Osteria Chiana Susan Wright
                  </a>
                </h3>

                <div class="flex flex-col mt-5 gap-y-2">
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ 'ristorante@icloud.com' }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">+39 349 087 4007</div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">http://sito.it</div>
                </div>
              </div>
              <div class="relative mt-8 flex items-center gap-x-4">
                <div
                  class="flex flex-row items-center justify-center col-span-1 rounded-lg p-3 w-full cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </div>
              </div>
            </div>
          </article>

          <!-- More posts... -->
        </div>
      </div>
    </div>
    <footer class="bg-zinc-50 dark:bg-zinc-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" class="sr-only">Footer</h2>
      <div class="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div class="border-t border-black/10 dark:border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <div class="flex space-x-6 md:order-2">
            <a
              class="flex flex-row items-center text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 cursor-pointer"
              (click)="settings.openDialog()"
            >
              <span [inlineSVG]="'gear-2.svg'" class="svg-icon svg-icon-3 stroke-[1.6] mx-1"></span>
            </a>
          </div>
          <p class="mt-8 text-sm leading-5 text-zinc-600 dark:text-zinc-400 md:order-1 md:mt-0">
            &copy; {{ currentYear }} Diamonds Consulting, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class StructuresComponent {
  settings = inject(SettingsService);
  readonly currentYear = moment(new Date()).year();
}
