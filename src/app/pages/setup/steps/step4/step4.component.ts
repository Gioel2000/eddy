import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WorldComponent } from '../../../../ui/world/world.component';
import { StepperComponent } from '../../stepper/stepper.component';
import { TranslateModule } from '@ngx-translate/core';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';
import { SettingsService } from '../../../../ui/settings/settings.service';
import { UserPanelService } from '../../../../ui/user/user.service';
import moment from 'moment';
import { ThemeManagerStore } from '../../../../store/theme/theme.service';
import { StructureStore } from '../../../../store/structures/structure.service';

@Component({
  selector: 'step4',
  standalone: true,
  imports: [CommonModule, WorldComponent, StepperComponent, TranslateModule, MissingTranslationPipe],
  template: `
    <div class="relative isolate overflow-hidden bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-black/10 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width="200"
            height="200"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y="-1" class="overflow-visible fill-zinc-200/20 dark:fill-zinc-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            stroke-width="0"
          />
        </svg>
        <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
      </svg>
      <div
        class="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-accent to-accent opacity-20"
          style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"
        ></div>
      </div>
      <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-normal">
            <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
              Eddy
              <span class="text-dark dark:text-white">.</span>
            </h1>
          </a>
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            {{ 'CONGRATULATIONS' | translate }}!
          </h1>
          <p class="mt-6 text-base leading-6 text-zinc-700 dark:text-zinc-300">
            {{ 'CONFIGURATION_COMPLETED' | translate }}
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <button
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px hover:shadow-lg hover:shadow-accent/70 dark:hover:shadow-accentDark/70 cursor-pointer focus:outline-none"
              (click)="structure.setConfigurationCompleted()"
            >
              <div
                class="flex flex-row items-center justify-center gap-x-2 svg-icon-7 stroke-2 bg-accent dark:bg-accentDark h-full px-4 py-3 rounded-[7px] cursor-pointer"
              >
                <span class="font-semibold text-base"> {{ 'START' | translate }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>flag</title>
                  <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                    <path
                      d="M3.75,3.24c1.161-.808,2.256-1.142,3.281-.984,1.69,.259,2.245,1.709,3.938,1.969,1.013,.155,2.106-.167,3.281-.984v6.563c-1.175,.818-2.268,1.14-3.281,.984-1.692-.26-2.248-1.71-3.938-1.969-1.026-.157-2.12,.177-3.281,.984"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <line
                      x1="3.75"
                      y1="2"
                      x2="3.75"
                      y2="16"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke="currentColor"
                    ></line>
                  </g>
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              [src]="theme() === 'light' ? 'assets/images/app-screenshot.png' : 'assets/images/app-screenshot-dark.png'"
              alt="App screenshot"
              width="2432"
              height="1442"
              class="w-[76rem] rounded-xl bg-black/5 dark:bg-white/5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
            />
          </div>
        </div>
      </div>
      <footer class="bg-zinc-100 dark:bg-dark border-t border-zinc-300 dark:border-zinc-800">
        <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <div class="flex justify-center space-x-6 mt-5 sm:pt-0">
            <a
              href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
              class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
              title="Cookie Policy"
              ><span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>cookie</title>
                  <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                    <path
                      d="M14.75,8c-1.91,0-3.469-1.433-3.703-3.28-.099,.01-.195,.03-.297,.03-1.618,0-2.928-1.283-2.989-2.887-3.413,.589-6.011,3.556-6.011,7.137,0,4.004,3.246,7.25,7.25,7.25s7.25-3.246,7.25-7.25c0-.434-.045-.857-.118-1.271-.428,.17-.893,.271-1.382,.271Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <circle cx="12.25" cy="1.75" r=".75" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle cx="14.75" cy="4.25" r=".75" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle
                      cx="11.25"
                      cy="11.75"
                      r=".75"
                      data-color="color-2"
                      data-stroke="none"
                      stroke="none"
                    ></circle>
                    <circle cx="7" cy="7" r="1" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle
                      cx="7.25"
                      cy="11.25"
                      r="1.25"
                      data-color="color-2"
                      data-stroke="none"
                      stroke="none"
                    ></circle>
                  </g>
                </svg> </span
              >Cookie Policy</a
            >
            <script type="text/javascript">
              (function (w, d) {
                var loader = function () {
                  var s = d.createElement('script'),
                    tag = d.getElementsByTagName('script')[0];
                  s.src = 'https://cdn.iubenda.com/iubenda.js';
                  tag.parentNode.insertBefore(s, tag);
                };
                if (w.addEventListener) {
                  w.addEventListener('load', loader, false);
                } else if (w.attachEvent) {
                  w.attachEvent('onload', loader);
                } else {
                  w.onload = loader;
                }
              })(window, document);
            </script>
            <a
              href="https://www.iubenda.com/privacy-policy/40734880"
              class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
              title="Privacy Policy"
              ><span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>lock</title>
                  <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                    <path
                      d="M5.75,8.25v-3.25c0-1.795,1.455-3.25,3.25-3.25h0c1.795,0,3.25,1.455,3.25,3.25v3.25"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></path>
                    <line
                      x1="9"
                      y1="11.75"
                      x2="9"
                      y2="12.75"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></line>
                    <rect
                      x="3.25"
                      y="8.25"
                      width="11.5"
                      height="8"
                      rx="2"
                      ry="2"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></rect>
                  </g>
                </svg> </span
              >Privacy Policy</a
            >
            <script type="text/javascript">
              (function (w, d) {
                var loader = function () {
                  var s = d.createElement('script'),
                    tag = d.getElementsByTagName('script')[0];
                  s.src = 'https://cdn.iubenda.com/iubenda.js';
                  tag.parentNode.insertBefore(s, tag);
                };
                if (w.addEventListener) {
                  w.addEventListener('load', loader, false);
                } else if (w.attachEvent) {
                  w.attachEvent('onload', loader);
                } else {
                  w.onload = loader;
                }
              })(window, document);
            </script>
            <a
              class="flex flex-row gap-x-1 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm shadow-black/10 dark:shadow-black rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 ring-zinc-900/10 dark:ring-zinc-50/20"
              href="mailto:support@eddy.restaurant"
            >
              <span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>circle question</title>
                  <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                    <circle cx="9" cy="9" r="7.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                    <path
                      d="M6.925,6.619c.388-1.057,1.294-1.492,2.18-1.492,.895,0,1.818,.638,1.818,1.808,0,1.784-1.816,1.468-2.096,3.065"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M8.791,13.567c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                      stroke="none"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </span>
              <span>{{ 'HELP' | translate }}</span>
            </a>
          </div>
          <nav class="-mb-6 mt-10 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div class="pb-6 text-center">
              <a
                class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
                (click)="userPanelUI.togglePanel()"
                >{{ 'MY_PROFILE' | translate }}</a
              >
            </div>
            <div class="pb-6 text-center">
              <a
                class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
                (click)="settings.openDialog()"
                >{{ 'SETTINGS' | translate }}</a
              >
            </div>
          </nav>

          <p class="mt-10 text-center text-xs leading-5 text-zinc-500">
            &copy; {{ currentYear }} Diamond Tech, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class Step4Component {
  settings = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  structure = inject(StructureStore);
  themeStore = inject(ThemeManagerStore);
  currentYear = moment().format('YYYY');

  theme = computed(() => this.themeStore.theme());
}
