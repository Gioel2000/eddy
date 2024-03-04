import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AppServiceService } from './app.service';
import { UserStore } from './store/user/user.service';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './ui/settings/settings.component';
import { SettingsService } from './ui/settings/settings.service';
import { LoaderComponent } from './ui/loader/loader.component';
import moment from 'moment';
import { ClickOutsideDirective } from './utils/directives/clickoutside';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    NgOptimizedImage,
    TranslateModule,
    InlineSVGModule,
    SettingsComponent,
    LoaderComponent,
    ClickOutsideDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @defer (on viewport; prefetch on idle) {
      <settings></settings>
    } @placeholder {
      <div></div>
    } @loading {
      <div></div>
    }

    <div>
      <div 
	  	  [ngClass]="{ hidden: !app.isMenuOpen() }"
        (click)="app.closeMenu()"
      >
        <div
          class="transition-opacity ease-linear duration-200 relative z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          [ngClass]="{
            'opacity-100': app.isMenuVisible(),
            'opacity-0': !app.isMenuVisible()
          }"
        >
          <div class="fixed inset-0 bg-zinc-100/80 dark:bg-zinc-900/80"></div>
          <div
            class="transition ease-in-out duration-200 transform fixed inset-0 flex"
            [ngClass]="{
              'translate-x-0': app.isMenuVisible(),
              '-translate-x-full': !app.isMenuVisible()
            }"
          >
            <div
              class="ease-in-out duration-200 relative mr-16 flex w-full max-w-xs flex-1"
              [ngClass]="{
                'opacity-100': app.isMenuVisible(),
                'opacity-0': !app.isMenuVisible()
              }"
            >
              <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" class="-m-2.5 p-2.5" (click)="app.closeMenu()">
                  <span inlineSVG="xmark.svg" class="text-zinc-800 dark:text-zinc-200"></span>
                </button>
              </div>

              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 border-r border-zinc-300 dark:border-zinc-700/50"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <div class="flex flex-row items-center">
                    <div class="flex flex-row items-center">
                      <span class="text-black/80 dark:text-white text-2xl font-bold">
                          Side
                      </span>
                      <span class="text-2xl font-bold scale-x-[-1] bg-gradient-to-t from-purple-600 via-rose-500 to-rose-500 inline-block text-transparent bg-clip-text">
                          k
                      </span>
                      <span class="text-black/80 dark:text-white text-2xl font-bold">
                          ic
                      </span>
                      <span class="text-black/80 dark:text-white text-2xl font-bold scale-x-[-1]">
                          k
                      </span>
                    </div>
                  </div>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7 text-zinc-500">
                    <li>
                      @for (route of router.config; track $index) { @if (route.data; as routeData) { @if (routeData &&
                        routeData['show']) {
                        <li>
                          <a
                            [routerLink]="['/' + route.path]"
                            class="flex flex-row items-center rounded-lg py-2 px-2.5 text-sm leading-6 font-medium mb-1 cursor-pointer"
                            routerLinkActive="bg-gradient-to-r from-purple-600 via-rose-500 to-rose-500 text-white shadow-[shadow:inset_0_1.5px_theme(colors.white/20%)] text-white shadow-sm shadow-black/30"
                          >
                            <span class="mr-2" [inlineSVG]="routeData['icon']"></span>
                            {{ routeData['i18n'] | translate }}
                          </a>
                        </li>
                        } } }
                    </li>
                    <li class="mt-auto">
                      @switch (user.status()) { @case ('loaded') {
                      <a class="flex items-center gap-x-4 lg:gap-x-6">
                        <div class="relative">
                          <button
                            type="button"
                            class="-m-1.5 flex items-center p-1.5"
                            id="user-menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            routerLink="/profile"
                          >
                            <span class="sr-only">Open user menu</span>
                            <img class="h-8 w-8 rounded-full bg-zinc-50" [src]="user.me().picture" alt="" />
                            <span class="flex flex-col items-start ml-3">
                              <span
                                class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200"
                                aria-hidden="true"
                                >{{ user.me().name }} {{ user.me().surname }}</span
                              >
                              <a class="text-xs font-medium text-zinc-500 dark:text-zinc-500 hover:underline">{{
                                'VIEW_PROFILE' | translate
                              }}</a>
                            </span>
                          </button>
                        </div>
                      </a>
                      } @case ('loading') {
                      <a class="flex items-center gap-x-4 lg:gap-x-6">
                        <div class="relative">
                          <button
                            type="button"
                            class="-m-1.5 flex items-center p-1.5"
                            id="user-menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                          >
                            <span class="sr-only">Open user menu</span>
                            <div
                              class="h-8 w-8 animate-pulse transition ease-in-out duration-200 bg-zinc-300 rounded-full dark:bg-zinc-800"
                            ></div>
                            <span class="hidden lg:flex lg:items-center">
                              <span
                                class="ml-2 text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200"
                                aria-hidden="true"
                                ><div
                                  class="h-4 animate-pulse transition ease-in-out duration-200 bg-zinc-300 rounded-full dark:bg-zinc-800 w-44"
                                ></div
                              ></span>
                            </span>
                          </button>
                        </div>
                      </a>
                      } }
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-zinc-50 dark:bg-dark"
      >
        <div class="flex grow flex-col gap-y-6 overflow-y-auto px-10 py-6">
          <div class="flex h-16 shrink-0 items-center">
            <a class="flex flex-row items-center hover:scale-110 transition-all transform-gpu ease-in-out duration-100 cursor-pointer font-[Pacifico] text-2xl font-bold">
              <h1 class="text-accent -tracking-[0.05rem]">
                Eddy
                <span class="text-dark dark:text-white">.</span>
              </h1>
            </a>
          </div>
          <nav class="-ml-3 flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="space-y-1 text-zinc-800 dark:text-zinc-200">
                  @for (route of router.config; track $index) { @if (route.data; as routeData) { @if (routeData &&
                  routeData['show']) {
                  <li 
                    class="rounded-lg"
                  >
                    <a
                      [routerLink]="['/' + route.path]"
                      class="flex flex-row items-center rounded-lg px-3 py-2 text-sm leading-6 font-medium mb-1 cursor-pointer"
                      routerLinkActive="text-accent font-semibold rounded-lg bg-zinc-600/5 dark:bg-zinc-300/5"
                    >
                      <span class="mr-2 svg-icon-2 stroke-[1.8]" [inlineSVG]="routeData['icon']"></span>
                      <span class="text-sm font-semibold">{{ routeData['i18n'] | translate }}</span>
                    </a>
                  </li>
                  } } }
                </ul>
              </li>

              <li class="mt-auto">
                @switch (user.status()) { @case ('loaded') {
                <a class="flex items-center gap-x-4 lg:gap-x-6">
                  <div class="relative w-full">
                    <div [ngClass]="{ hidden: !app.isMenuOpen() }">
                      <div
                        class="absolute bottom-12 z-10 mt-2 w-56 origin-bottom divide-y divide-zinc-300 dark:divide-zinc-700/80 rounded-lg bg-zinc-50 dark:bg-zinc-800 shadow-lg ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700/80 focus:outline-none transition ease-out duration-200"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                        [ngClass]="{
                          'opacity-100 scale-100': app.isMenuVisible(),
                          'opacity-0 scale-90': !app.isMenuVisible()
                        }"
                      >
                        <div class="px-4 py-3" role="none">
                          ciao
                        </div>
                        <div class="py-2" role="none">
                          <a (click)="settings.openDialog()" class="block px-4 py-2 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700/80" role="menuitem" tabindex="-1" id="menu-item-0">
                            <div class="flex flex-row items-center w-full">
                              <span class="mr-2 svg-icon-3 stroke-[1.6] text-zinc-700 dark:text-zinc-300" [inlineSVG]="'cog.svg'"></span>
                              <span class="text-sm font-normal text-zinc-700 dark:text-zinc-300">{{ "SETTINGS" | translate }}</span>
                            </div>
                          </a>
                          <a routerLink="/profile" class="block px-4 py-2 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700/80" role="menuitem" tabindex="-1" id="menu-item-0">
                            <div class="flex flex-row items-center w-full">
                              <span class="mr-2 svg-icon-3 stroke-[1.6] text-zinc-700 dark:text-zinc-300" [inlineSVG]="'user.svg'"></span>
                              <span class="text-sm font-normal text-zinc-700 dark:text-zinc-300">{{ "MY_PROFILE" | translate }}</span>
                            </div>
                          </a>
                        </div>
                      </div>
                      </div>
                    <button
                      type="button"
                      class="flex items-center p-2 w-full hover:bg-zinc-600/5 dark:hover:bg-zinc-300/5 rounded-lg"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      (click)="app.toggleMenu()"
                      (clickOutside)="app.closeMenu()"
                    >
                        <div class="flex flex-row items-center justify-between w-full">
                          <div class="flex flex-row items-center">
                            <div class="flex flex-col items-center justify-center h-6 w-6 rounded-full bg-accent text-white text-xs uppercase">M</div>
                            <span class="flex flex-col items-start ml-3">
                                <span class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200 max-w-32 truncate" aria-hidden="true"
                                    >Monaco Enoteca Pub Ciao Mario</span
                                >
                            </span>
                          </div>
                          <span class="mr-2 svg-icon-2 stroke-[1.8] text-zinc-900 dark:text-zinc-100" [inlineSVG]="'dots-vertical.svg'"></span>
                        </div>
                    </button>
                  </div>
                </a>
                } @case ('loading') {
                <a class="flex items-center gap-x-4 lg:gap-x-6">
                  <div class="relative">
                    <button
                      type="button"
                      class="-m-1.5 flex items-center p-1.5"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span class="sr-only">Open user menu</span>
                      <div
                        class="h-8 w-8 animate-pulse transition ease-in-out duration-200 bg-zinc-300 rounded-full dark:bg-zinc-800"
                      ></div>
                      <span class="hidden lg:flex lg:items-center">
                        <span
                          class="ml-2 text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200"
                          aria-hidden="true"
                          ><div
                            class="h-4 animate-pulse transition ease-in-out duration-200 bg-zinc-300 rounded-full dark:bg-zinc-800 w-44"
                          ></div
                        ></span>
                      </span>
                    </button>
                  </div>
                </a>
                } }
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="lg:pl-72 py-8 bg-zinc-50 dark:bg-dark">
        <div class="flex flex-col items-center w-full">
          <div class="w-full max-w-[1600px]">
            <!-- <div
              class="sticky py-1 top-0 flex z-20 h-16 shrink-0 items-center gap-x-4 border-b border-zinc-300 dark:border-zinc-700/50 backdrop-blur-lg bg-zinc-50/80 dark:bg-zinc-900/80 px-4 sm:gap-x-6 sm:px-6 lg:px-8"
            >
              <button
                type="button"
                class="-m-2.5 p-2.5 text-zinc-700 dark:text-zinc-200 lg:hidden"
                (click)="app.openMenu()"
              >
                <span class="svg-icon-5" inlineSVG="menu.svg"></span>
              </button>

              <div class="h-6 w-px bg-zinc-100/10 dark:bg-zinc-900/10 lg:hidden" aria-hidden="true"></div>

              <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div class="relative flex flex-1">
                  <div class="flex flex-row items-center w-full">
                    <button
                      type="button"
                      class="flex fle-row items-center rounded-[0.65rem] px-3 py-2.5 text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1 ring-inset ring-zinc-500/30 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50 transition ease-in-out duration-200"
                      (click)="app.closeMenu();"
                    >
                    <span class="text-zinc-700 dark:text-zinc-200 mr-1.5">{{ 'SELECT_STRUCTURES' | translate }}</span>
                    <span class="text-zinc-700 dark:text-zinc-200" inlineSVG="chevron-expand-y.svg"></span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex flex-row items-center">
                <a
                  class="flex fle-row items-center rounded-[0.65rem] p-2.5 cursor-pointer text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1 ring-inset ring-zinc-500/30 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50 transition ease-in-out duration-200"
                  (click)="settings.openDialog()"
                >
                  <span class="text-zinc-700 dark:text-zinc-200" inlineSVG="gear-2.svg"></span>
                </a>
              </div>
            </div> -->
            <router-outlet
              (activate)="isRouterLoaded.set(true)"
              (deactivate)="isRouterLoaded.set(false)"
            ></router-outlet>
            @if (!isRouterLoaded()) {
              <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen bg-zinc-50 dark:bg-dark">
                <loader></loader>
              </div>
            }

            <footer class="bg-zinc-50 dark:bg-dark">
                <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                  <div class="flex justify-center space-x-6 md:order-2"></div>
                  <div class="mt-8 md:order-1 md:mt-0">
                    <p class="text-center text-xs leading-5 text-zinc-500">&copy; {{ year }} Diamonds Consulting, Inc. All rights reserved.</p>
                  </div>
                </div>
              </footer>
          </div>
        </div>
      </div>
    </div>
`,
})
export class AppComponent {
  app = inject(AppServiceService);
  settings = inject(SettingsService);
  user = inject(UserStore);
  router = inject(Router);

  year = moment().format('YYYY');
  isRouterLoaded = signal(false);
}
