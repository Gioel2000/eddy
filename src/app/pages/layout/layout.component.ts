import { CUSTOM_ELEMENTS_SCHEMA, Component, effect, inject, signal } from '@angular/core';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { RestaurantPanelService } from '../../ui/restaurant/panel.service';

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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
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
                            [routerLink]="['/' + route.path]"
                            class="flex flex-row items-center rounded-lg px-3 py-2 text-sm leading-6 font-medium mb-1 cursor-pointer"
                            routerLinkActive="text-accent dark:text-accentDark font-semibold rounded-lg bg-zinc-500/5 dark:bg-zinc-300/5"
                            (click)="layout.closeMenu()"
                          >
                            <span class="mr-2 svg-icon-6 stroke-2" [inlineSVG]="routeData['icon']"></span>
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
                              class="absolute bottom-12 z-10 mt-2 w-full origin-bottom divide-y divide-zinc-300 dark:divide-zinc-700/80 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1  ring-zinc-300 dark:ring-zinc-700/80 focus:outline-none transition ease-out duration-200"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="menu-button"
                              tabindex="-1"
                              [ngClass]="{
                                'opacity-100 scale-100': layout.isDropdownVisibleSm(),
                                'opacity-0 scale-90': !layout.isDropdownVisibleSm()
                              }"
                            >
                              <div class="px-0.5 pt-0.5" role="none">
                                <div class="relative">
                                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span
                                      [inlineSVG]="'magnifier.svg'"
                                      class="svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600"
                                    ></span>
                                  </div>
                                  <input
                                    type="text"
                                    class="block w-full rounded-xl border-0 bg-white dark:bg-zinc-800 py-1.5 pl-10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-0 text-sm leading-6"
                                    placeholder="{{ 'SEARCH' | translate }}..."
                                    [formControl]="searchFormControl"
                                    (blur)="isSearchBlur.set(true)"
                                    (focus)="isSearchBlur.set(false)"
                                  />
                                </div>
                              </div>
                                <ul class="z-10 max-h-56 w-full overflow-y-auto py-1 text-base focus:outline-none sm:text-sm">
                                  @switch(structures.state()) {
                                    @case('loaded') {
                                      @for (restaurant of structures.structures(); track $index) { 
                                      <li
                                        class="text-zinc-900 dark:text-zinc-100 relative cursor-default select-none py-2 pl-3 pr-9"
                                        id="listbox-option-0"
                                        role="option"
                                        (click)="structures.choose(restaurant._id)"
                                      >
                                        <div class="flex items-center">
                                          <div class="flex flex-row items-center justify-center bg-accent dark:bg-accentDark text-xs text-white h-6 w-6 flex-shrink-0 rounded-full">{{  restaurant.name | substring : 0 : 1}}</div>
                                          <span class="font-normal text-sm ml-2 block truncate">{{ restaurant.name }}</span>
                                        </div>

                                        @if (structures.selected(); as selected) {
                                          @if (selected._id === restaurant._id) {
                                          <span class="text-accent dark:text-accentDark absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                            </svg>
                                          </span>
                                          }
                                        }
                                      </li>
                                    }
                                    } @case('loading') {
                                    <ng-container *ngTemplateOutlet="loading"></ng-container>
                                    } @case('error') {
                                    <ng-container *ngTemplateOutlet="error"></ng-container>
                                    } @default {
                                    <ng-container *ngTemplateOutlet="empty"></ng-container>
                                    } 
                                  }
                                </ul>
                              <div class="py-2" role="none">
                                <a
                                  (click)="restaurantPanelUI.togglePanel(); layout.closeMenu()"
                                  class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                      [inlineSVG]="'shop.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                      'MY_RESTAURANT' | translate
                                    }}</span>
                                  </div>
                                </a>
                                <a
                                  (click)="userPanelUI.togglePanel(); layout.closeMenu()"
                                  class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                      [inlineSVG]="'user.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                      'MY_PROFILE' | translate
                                    }}</span>
                                  </div>
                                </a>
                                <a
                                  (click)="settings.openDialog(); layout.closeMenu()"
                                  class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                                  role="menuitem"
                                  tabindex="-1"
                                  id="menu-item-0"
                                >
                                  <div class="flex flex-row items-center w-full">
                                    <span
                                      class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                      [inlineSVG]="'gear-2.svg'"
                                    ></span>
                                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                      'SETTINGS' | translate
                                    }}</span>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          @switch (structures.selectedState()) {
                            @case ('loaded') {
                              @if (structures.selected(); as structureSelected) {
                              <button
                                type="button"
                                class="flex items-center p-2 w-full hover:bg-zinc-600/5 dark:hover:bg-zinc-300/5 rounded-lg"
                                id="user-menu-button"
                                aria-expanded="false"
                                aria-haspopup="true"
                                (click)="layout.toggleDropdownSm()"
                                (clickOutside)="isSearchBlur() && layout.closeDropdownSm()"
                              >
                                <div class="flex flex-row items-center justify-between w-full">
                                  <div class="flex flex-row items-center">
                                    <div
                                      class="flex flex-col items-center justify-center h-6 w-6 rounded-full bg-accent dark:bg-accentDark text-white text-xs uppercase"
                                    >
                                      {{ structureSelected.name | substring : 0 : 1}}
                                    </div>
                                    <span class="flex flex-col items-start ml-3">
                                      <span
                                        class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200 max-w-32 truncate"
                                        aria-hidden="true"
                                        >{{ structureSelected.name }}</span
                                      >
                                    </span>
                                  </div>
                                  <span
                                    class="svg-icon-7 stroke-2 text-zinc-900 dark:text-zinc-100"
                                    [inlineSVG]="'dots-vertical.svg'"
                                  ></span>
                                </div>
                              </button>
                              }
                            } @case ('loading') {
                              <div class="flex flex-row items-center justify-start w-full px-4 py-2">
                                <div class="flex flex-row items-center justify-start w-full">
                                  <loader></loader>
                                </div>
                              </div>
                            }
                          }
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
              class="flex flex-row items-center hover:scale-110 transition-all transform-gpu ease-in-out duration-100 cursor-pointer font-[Pacifico] text-2xl font-bold"
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
                <ul role="list" class="space-y-1 text-zinc-800 dark:text-zinc-200">
                  @for (route of router.config[0].children; track $index) { @if (route.data; as routeData) { @if (routeData &&
                  routeData['show']) {
                  <li 
                    class="rounded-lg"
                  >
                    <a
                      [routerLink]="['/' + route.path]"
                      class="flex flex-row items-center rounded-lg px-3 py-2 text-sm leading-6 font-medium mb-1 cursor-pointer"
                      routerLinkActive="text-accent dark:text-accentDark font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-300/5"
                    >
                      <span class="mr-2 svg-icon-6 stroke-2" [inlineSVG]="routeData['icon']"></span>
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
                        class="absolute bottom-12 z-10 mt-2 w-56 origin-bottom divide-y divide-zinc-300 dark:divide-zinc-700/80 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1  ring-zinc-300 dark:ring-zinc-700/80 focus:outline-none transition ease-out duration-200"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                        [ngClass]="{
                          'opacity-100 scale-100': layout.isDropdownVisible(),
                          'opacity-0 scale-90': !layout.isDropdownVisible()
                        }"
                      >
                        <div class="px-0.5 pt-0.5" role="none">
                          <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span
                                [inlineSVG]="'magnifier.svg'"
                                class="svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600"
                              ></span>
                            </div>
                            <input
                              type="text"
                              class="block w-full rounded-xl border-0 bg-white dark:bg-zinc-800 py-1.5 pl-10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-0 text-sm leading-6"
                              placeholder="{{ 'SEARCH' | translate }}..."
                              [formControl]="searchFormControl"
                              (blur)="isSearchBlur.set(true)"
                              (focus)="isSearchBlur.set(false)"
                            />
                          </div>
                        </div>
                          <ul class="z-10 max-h-56 w-full overflow-y-auto py-1 text-base focus:outline-none sm:text-sm">
                            @switch(structures.state()) {
                              @case('loaded') {
                                @for (restaurant of structures.structures(); track $index) { 
                                <li
                                  class="text-zinc-900 dark:text-zinc-100 relative cursor-default select-none py-2 pl-3 pr-9"
                                  id="listbox-option-0"
                                  role="option"
                                  (click)="structures.choose(restaurant._id)"
                                >
                                  <div class="flex items-center">
                                    <div class="flex flex-row items-center justify-center bg-accent dark:bg-accentDark text-xs text-white h-6 w-6 flex-shrink-0 rounded-full">{{  restaurant.name | substring : 0 : 1}}</div>
                                    <span class="font-normal ml-2 block truncate">{{ restaurant.name }}</span>
                                  </div>
                                  @if (structures.selected(); as selected) {
                                    @if (selected._id === restaurant._id) {
                                    <span class="text-accent dark:text-accentDark absolute inset-y-0 right-0 flex items-center pr-4">
                                      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                      </svg>
                                    </span>
                                    
                                    }
                                  }
                                </li>
                              }
                              } @case('loading') {
                              <ng-container *ngTemplateOutlet="loading"></ng-container>
                              } @case('error') {
                              <ng-container *ngTemplateOutlet="error"></ng-container>
                              } @default {
                              <ng-container *ngTemplateOutlet="empty"></ng-container>
                              } 
                            }
                          </ul>
                        <div class="py-2" role="none">
                          <a
                            class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                            (click)="restaurantPanelUI.togglePanel()"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                [inlineSVG]="'shop.svg'"
                              ></span>
                              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                'MY_RESTAURANT' | translate
                              }}</span>
                            </div>
                          </a>
                          <a
                            (click)="userPanelUI.togglePanel()"
                            class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                [inlineSVG]="'user.svg'"
                              ></span>
                              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                'MY_PROFILE' | translate
                              }}</span>
                            </div>
                          </a>
                          <a
                            (click)="settings.openDialog()"
                            class="block px-4 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700/80"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                          >
                            <div class="flex flex-row items-center w-full">
                              <span
                                class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                                [inlineSVG]="'gear-2.svg'"
                              ></span>
                              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{
                                'SETTINGS' | translate
                              }}</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    @switch (structures.selectedState()) {
                      @case ('loaded') {
                        @if (structures.selected(); as structureSelected) {
                        <button
                          type="button"
                          class="flex items-center p-2 w-full hover:bg-zinc-600/5 dark:hover:bg-zinc-300/5 rounded-lg"
                          id="user-menu-button"
                          aria-expanded="false"
                          aria-haspopup="true"
                          (click)="layout.toggleDropdown()"
                          (clickOutside)="isSearchBlur() && layout.closeDropdown()"
                        >
                          <div class="flex flex-row items-center justify-between w-full">
                            <div class="flex flex-row items-center">
                              <div
                                class="flex flex-col items-center justify-center h-6 w-6 rounded-full bg-accent dark:bg-accentDark text-white text-xs uppercase"
                              >
                                {{ structureSelected.name | substring : 0 : 1}}
                              </div>
                              <span class="flex flex-col items-start ml-3">
                                <span
                                  class="text-sm font-normal leading-6 text-zinc-800 dark:text-zinc-200 max-w-32 truncate"
                                  aria-hidden="true"
                                  >{{ structureSelected.name }}</span
                                >
                              </span>
                            </div>
                            <span
                              class="svg-icon-7 stroke-2 text-zinc-900 dark:text-zinc-100"
                              [inlineSVG]="'dots-vertical.svg'"
                            ></span>
                          </div>
                        </button>
                        }
                      } @case ('loading') {
                        <div class="flex flex-row items-center justify-start w-full px-4 py-2">
                          <div class="flex flex-row items-center justify-start w-full">
                            <loader></loader>
                          </div>
                        </div>
                      }}
                  </div>
                </a>
                <!-- <a class="flex items-center gap-x-4 lg:gap-x-6">
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
                </a> -->
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
                  <span class="svg-icon-5 stroke-[1.6] text-zinc-800 dark:text-zinc-200" inlineSVG="menu.svg"></span>
                </button>

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
                    &copy; {{ year }} Diamonds Consulting, Inc. All rights reserved.
                  </p>
                </div>
                <div class="flex justify-center space-x-6 mt-5 sm:pt-0">
                  <a
                    class="flex flex-row items-center gap-x-1 text-sm font-medium text-zinc-400 dark:text-zinc-600"
                    href="mailto:support@eddy.restaurant"
                  >
                    <span class="svg-icon-6 stroke-[1.6]" inlineSVG="circle-question.svg"></span>
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
  restaurantPanelUI = inject(RestaurantPanelService);
  router = inject(Router);
  structures = inject(StructureStore);
  searchFormControl = new FormControl('');
  isSearchBlur = signal(true);

  year = moment().format('YYYY');
  isRouterLoaded = signal(false);

  constructor() {
    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.structures.search$.next(value));
  }
}
