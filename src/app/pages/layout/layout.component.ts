import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { SettingsComponent } from '../../ui/settings/settings.component';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { LayoutUIService } from './layout.service';
import { SettingsService } from '../../ui/settings/settings.service';
import { UserPanelService } from '../../ui/user/user.service';
import { StructureStore } from '../../store/structures/structure.service';
import { SubstringPipe } from '../../utils/pipes/substring.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RestaurantPanelService } from '../../ui/restaurant/panel.service';
import { UserStore } from '../../store/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';

@UntilDestroy()
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
    SubstringPipe,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div>
      <div [ngClass]="{ hidden: !layout.isMenuOpen() }">
        <div
          class="transition-opacity ease-linear duration-200 relative z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          [ngClass]="{
            'opacity-100': layout.isMenuVisible(),
            'opacity-0': !layout.isMenuVisible()
          }"
        >
          <div class="fixed inset-0 bg-zinc-100/80 dark:bg-zinc-900/80"></div>
          <div
            class="transition ease-in-out duration-200 transform fixed inset-0 flex"
            [ngClass]="{
              'translate-x-0': layout.isMenuVisible(),
              '-translate-x-full': !layout.isMenuVisible()
            }"
          >
            <div
              class="ease-in-out duration-200 relative mr-16 flex w-full max-w-xs flex-1"
              [ngClass]="{
                'opacity-100': layout.isMenuVisible(),
                'opacity-0': !layout.isMenuVisible()
              }"
            >
              <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" class="-m-2.5 p-2.5" (click)="layout.closeMenu()">
                  <span inlineSVG="xmark.svg" class="text-zinc-800 dark:text-zinc-200"></span>
                </button>
              </div>

              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 border-r border-zinc-200 dark:border-zinc-800 bg-light dark:bg-dark"
                (clickOutside)="layout.isMenuVisible() && layout.closeMenu()"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <div class="flex flex-row items-center">
                    <div class="flex flex-row items-center">
                      <a
                        class="flex flex-row items-center hover:scale-110 transition-all transform-gpu ease-in-out duration-100 cursor-pointer font-[Pacifico] text-2xl font-bold"
                      >
                        <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
                          Eddy
                          <span class="text-dark dark:text-white">.</span>
                        </h1>
                      </a>
                    </div>
                  </div>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7 text-zinc-900 dark:text-zinc-100">
                    <li>
                      @for (route of router.config[0].children; track $index) { @if (route.data; as routeData) { @if (routeData &&
                        routeData['show']) {
                        <li>
                          <a
                            [id]="'menu-item-' + $index"
                            [routerLink]="['/' + route.path]"
                            class="flex flex-row items-center rounded-lg px-3 py-2 text-sm leading-6 font-medium mb-1 cursor-pointer"
                            routerLinkActive="text-zinc-950 dark:text-zinc-50 font-semibold rounded-lg bg-zinc-700/5 dark:bg-zinc-300/5"
                            (click)="layout.closeMenu()"
                          >
                            <span class="mr-2 svg-icon svg-icon-6 stroke-2" [inlineSVG]="routeData['icon']"></span>
                            <span class="text-sm font-semibold">{{ routeData['i18n'] | translate }}</span>
                          </a>
                        </li>
                        } } }
                    </li>
                    <li class="mt-auto">
                      <a class="flex items-center gap-x-4 lg:gap-x-6">
                        <div class="relative w-full">
                          <div [ngClass]="{ hidden: !layout.isDropdownOpenSm() }">
                            <div
                              class="absolute bottom-14 z-10 mt-2 w-full origin-bottom divide-y divide-zinc-200 dark:divide-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabindex="-1"
                              [ngClass]="{
                                'opacity-100 scale-100': layout.isDropdownVisibleSm(),
                                'opacity-0 scale-90': !layout.isDropdownVisibleSm()
                              }"
                            >
                              <div
                                class="block px-4 py-3 text-sm cursor-pointer w-full"
                              >
                                  <a
                                    class="group flex flex-col w-full cursor-pointer gap-y-0.5 transition-all transform-gpu ease-in-out duration-200"
                                    (click)="layout.closeMenu(); restaurantPanelUI.togglePanel()"
                                  >
                                    <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                                      <div class="flex flex-col gap-x-2 w-full">
                                        <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                                          <p
                                            class="max-w-36 text-base truncate font-semibold text-zinc-700 dark:text-zinc-100 group-hover:font-semibold group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200"
                                          >
                                            {{ structures.selected().name }}
                                          </p>
                                          <span
                                            [inlineSVG]="'share-up-right.svg'"
                                            class="group-hover:text-zinc-950 dark:group-hover:text-zinc-200 w-4 text-zinc-400 svg-icon svg-icon-9 stroke-[2.3] transition-all transform-gpu ease-in-out duration-200"
                                          ></span>
                                        </div>
                                        <span class="max-w-full truncate text-xs font-medium text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200">{{ structures.selected().address }}, {{ structures.selected().city }}</span>
                                      </div>
                                    </div>
                                  </a>
                              </div>
                              <div class="py-2" role="none">
                                <a
                                  (click)="layout.closeMenu(); settings.openDialog()"
                                  class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                                      [inlineSVG]="'gear-2.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                      'SETTINGS' | translate
                                    }}</span>
                                  </div>
                                </a>
                                <a
                                  class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                  (click)="layout.closeMenu(); userPanelUI.togglePanel()"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                                      [inlineSVG]="'user.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                      'USER' | translate
                                    }}</span>
                                  </div>
                                </a>
                              </div>
                              <div class="py-2" role="none">
                                <a
                                  class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                  (click)="logout()"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-red-600 dark:text-red-500 rotate-180"
                                      [inlineSVG]="'rect-logout.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-red-600 dark:text-red-500">{{
                                      'EXIT' | translate
                                    }}</span>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            class="flex items-center p-2 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all transform-gpu ease-in-out duration-200 rounded-lg"
                            id="user-menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            (click)="layout.toggleDropdownSm()"
                            (clickOutside)="layout.closeDropdownSm()"
                            [ngClass]="{
                              'bg-zinc-100 dark:bg-zinc-800': layout.isDropdownVisible(),
                            }"
                          >
                            <div class="flex flex-row items-center justify-between w-full">
                              <div class="flex flex-row items-center">
                                <img
                                  class="h-7 w-7 sm:h-7 sm:w-7 rounded-full"
                                  [src]="user().picture"
                                  alt=""
                                />
                                <span class="flex flex-col items-start ml-3">
                                  <span
                                    class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200 max-w-32 truncate"
                                    aria-hidden="true"
                                    >{{ user().name }} {{ user().surname }}</span
                                  >
                                </span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-white dark:bg-dark">
        <div class="flex grow flex-col gap-y-6 overflow-y-auto px-10 py-6">
          <div class="flex h-16 shrink-0 items-center">
            <a
              class="flex flex-row items-center hover:scale-110 transition-all transform-gpu ease-in-out duration-100 cursor-pointer font-[Pacifico] text-2xl font-medium"
            >
              <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
                Eddy
                <span class="text-dark dark:text-white">.</span>
              </h1>
            </a>
          </div>
          <nav class="-ml-3 flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="space-y-1 text-zinc-700 dark:text-zinc-300">
                  @for (route of router.config[0].children; track $index) { @if (route.data; as routeData) { @if (routeData &&
                  routeData['show']) {
                  <li 
                    class="rounded-lg"
                  >
                    <a
                      [id]="'menu-item-' + $index"
                      [routerLink]="['/' + route.path]"
                      class="flex flex-row items-center rounded-lg px-3 py-2 text-sm leading-6 font-medium mb-1 cursor-pointer"
                      routerLinkActive="text-zinc-950 dark:text-zinc-50 font-semibold rounded-lg bg-zinc-700/5 dark:bg-zinc-300/5"
                    >
                      <span class="mr-2 svg-icon svg-icon-6 stroke-2" [inlineSVG]="routeData['icon']"></span>
                      <span class="text-sm font-semibold">{{ routeData['i18n'] | translate }}</span>
                    </a>
                  </li>
                  } } }
                </ul>
              </li>

              <li class="mt-auto">
                <a class="flex items-center gap-x-4 lg:gap-x-6">
                  <div class="relative w-full">
                    <div [ngClass]="{ hidden: !layout.isDropdownOpen() }">
                      <div
                        class="absolute bottom-14 z-10 mt-2 w-56 origin-bottom divide-y divide-zinc-200 dark:divide-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                        [ngClass]="{
                          'opacity-100 scale-100': layout.isDropdownVisible(),
                          'opacity-0 scale-90': !layout.isDropdownVisible()
                        }"
                      >
                        <div
                          class="block px-4 py-3 text-sm cursor-pointer w-full"
                        >
                            <button
                              id="structure-item"
                              class="group flex flex-col w-full cursor-pointer gap-y-0.5 transition-all transform-gpu ease-in-out duration-200"
                              (click)="restaurantPanelUI.togglePanel()"
                            >
                              <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                                <div class="flex flex-col gap-x-2 w-full">
                                  <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                                    <p
                                      class="max-w-36 text-base truncate font-semibold text-zinc-700 dark:text-zinc-100 group-hover:font-semibold group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200"
                                    >
                                      {{ structures.selected().name }}
                                    </p>
                                    <span
                                      [inlineSVG]="'share-up-right.svg'"
                                      class="group-hover:text-zinc-950 dark:group-hover:text-zinc-200 w-4 text-zinc-400 svg-icon svg-icon-9 stroke-[2.3] transition-all transform-gpu ease-in-out duration-200"
                                    ></span>
                                  </div>
                                  <span class="max-w-full text-left truncate text-xs font-medium text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200">{{ structures.selected().address }}, {{ structures.selected().city }}</span>
                                </div>
                              </div>
                            </button>
                        </div>
                        <div class="py-2" role="none">
                          <a
                            (click)="settings.openDialog()"
                            class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                                [inlineSVG]="'gear-2.svg'"
                              ></span>
                              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                'SETTINGS' | translate
                              }}</span>
                            </div>
                          </a>
                          <a
                            class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                            (click)="userPanelUI.togglePanel()"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                                [inlineSVG]="'user.svg'"
                              ></span>
                              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                'USER' | translate
                              }}</span>
                            </div>
                          </a>
                        </div>
                        <div class="py-2" role="none">
                          <a
                            class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                            (click)="logout()"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-red-600 dark:text-red-500 rotate-180"
                                [inlineSVG]="'rect-logout.svg'"
                              ></span>
                              <span class="text-sm font-medium text-red-600 dark:text-red-500">{{
                                'EXIT' | translate
                              }}</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="flex items-center p-2 w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all transform-gpu ease-in-out duration-200 rounded-lg"
                      id="user-menu-button-desktop"
                      aria-expanded="false"
                      aria-haspopup="true"
                      (click)="layout.toggleDropdown()"
                      (clickOutside)="layout.closeDropdown()"
                      [ngClass]="{
                        'bg-zinc-100 dark:bg-zinc-800': layout.isDropdownVisible(),
                      }"
                    >
                      <div class="flex flex-row items-center justify-between w-full">
                        <div class="flex flex-row items-center">
                          <img
                            class="h-7 w-7 sm:h-7 sm:w-7 rounded-full"
                            [src]="user().picture"
                            alt=""
                          />
                          <span class="flex flex-col items-start ml-3">
                            <span
                              class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200 max-w-32 truncate"
                              aria-hidden="true"
                              >{{ user().name }} {{ user().surname }}</span
                            >
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="lg:pl-72 py-8 bg-white dark:bg-dark">
        <div class="flex flex-col items-center w-full">
          <div class="w-full max-w-[1600px]">
            <div class="block lg:hidden relative -top-8">
              <div
                class="sticky py-1 top-0 flex z-20 h-16 shrink-0 items-center gap-x-4 backdrop-blur-lg bg-light dark:bg-dark px-4 sm:gap-x-6 sm:px-6 lg:px-8"
              >
                <button
                  type="button"
                  class="-m-2.5 p-2.5 text-zinc-700 dark:text-zinc-200 lg:hidden"
                  (click)="layout.openMenu()"
                >
                  <span class="svg-icon svg-icon-5 stroke-[1.6] text-zinc-800 dark:text-zinc-200" inlineSVG="menu.svg"></span>
                </button>

                <a
                  class="flex flex-row items-center hover:scale-110 transition-all transform-gpu ease-in-out duration-100 cursor-pointer font-[Pacifico] text-2xl font-medium"
                >
                  <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
                    Eddy
                    <span class="text-dark dark:text-white">.</span>
                  </h1>
                </a>
              </div>
            </div>

            <router-outlet
              (activate)="isRouterLoaded.set(true)"
              (deactivate)="isRouterLoaded.set(false)"
            ></router-outlet>
            @if (!isRouterLoaded()) {
            <div
              class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen bg-white dark:bg-dark"
            >
              <loader></loader>
            </div>
            }

            <footer class="bg-white dark:bg-dark mt-52">
              <div class="flex flex-col sm:flex-row items-center justify-between mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div class="mt-8">
                  <p class="text-center text-xs leading-5 text-zinc-500">
                    &copy; {{ year }} Diamond Tech, Inc. All rights reserved.
                  </p>
                </div>
                <div class="flex justify-center space-x-6 mt-5 sm:pt-0">
                  <a href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy" class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe" title="Cookie Policy"><span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="cookie.svg"></span>Cookie Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
                  <a href="https://www.iubenda.com/privacy-policy/40734880" class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe" title="Privacy Policy"><span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="lock.svg"></span>Privacy Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>
                  <a
                    class="flex flex-row gap-x-1 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm shadow-black/10 dark:shadow-black rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 ring-zinc-900/10 dark:ring-zinc-50/20"
                    href="mailto:support@eddy.restaurant"
                  >
                    <span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="circle-question.svg"></span>
                    <span>{{ "HELP" | translate }}</span>
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  layout = inject(LayoutUIService);
  settings = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  auth = inject(AuthService);
  restaurantPanelUI = inject(RestaurantPanelService);
  router = inject(Router);
  structures = inject(StructureStore);
  profile = inject(UserStore);

  user = computed(() => this.profile.me());
  year = moment().format('YYYY');
  isRouterLoaded = signal(false);

  logout() {
    const { url } = environment;
    this.auth.logout().subscribe(() => window.open(url, '_self'));
  }
}
