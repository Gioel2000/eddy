import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SettingsService } from '../../ui/settings/settings.service';
import { UserPanelService } from '../../ui/user/user.service';
import { RestaurantPanelService } from '../../ui/create-restaurant/create-restaurant.service';
import { StructureStore } from '../../store/structures/structure.service';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, LoaderComponent, ReactiveFormsModule, NgOptimizedImage],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="bg-zinc-50 dark:bg-zinc-900 py-12 sm:py-24 min-h-screen">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="pb-12">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-bold">
            <h1 class="text-accent -tracking-[0.05rem]">
              Eddy
              <span class="text-dark dark:text-white">.</span>
            </h1>
          </a>
        </div>
        <div class="mx-auto">
          <div class="flex flex-row item-center justify-between w-full gap-x-4">
            <div class="flex flex-col">
              <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                {{ 'CHOOSE_RESTAURANT' | translate }}
              </h2>
              <p class="mt-2 text-lg leading-6 text-zinc-600 dark:text-zinc-400">
                {{ 'CHOOSE_RESTAURANT_DESCRIPTION' | translate }}
              </p>
            </div>
            <div class="flex flex-row items-center gap-x-2">
              <a
                class="flex flex-row items-center justify-center rounded-full p-3 w-full h-auto cursor-pointer text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                (click)="showSearch.set(!showSearch())"
              >
                <span [inlineSVG]="'magnifier.svg'" class="svg-icon svg-icon-3 stroke-2"></span>
              </a>
              <a
                class="flex flex-row items-center justify-center rounded-full p-3 w-full h-auto cursor-pointer ring-1 ring-inset ring-zinc-800 dark:ring-zinc-100 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-black shadow-[shadow:inset_0_1.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_1.5px_theme(colors.black/40%)]"
                (click)="restaurantPanelUI.openPanel()"
              >
                <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon-3 stroke-2"></span>
              </a>
            </div>
          </div>
        </div>

        @if (showSearch()) {
        <div>
          <div class="mt-16">
            <div class="relative mt-2 rounded-xl shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span
                  [inlineSVG]="'magnifier.svg'"
                  class="svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600"
                ></span>
              </div>
              <input
                type="text"
                class="block w-full rounded-xl border-0 dark:bg-zinc-900 py-3.5 pl-10 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                placeholder="{{ 'SEARCH' | translate }}..."
                [formControl]="searchFormControl"
              />
            </div>
          </div>
        </div>
        } @switch(store.state()) { @case('loaded') {
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          @for (structure of store.structures(); track $index) { @defer (on viewport; prefetch on idle) {
          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 shadow-sm shadow-black/10"
          >
            <div class="relative w-full">
              <img
                [ngSrc]="structure.image"
                alt=""
                width="768"
                height="432"
                priority
                class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 dark:bg-zinc-900 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
              />
              <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
            </div>
            <div class="w-full p-6">
              <div class="flex items-center gap-x-4 text-xs">
                <span class="text-zinc-500"
                  >{{ structure.address }}, {{ structure.zipCode }}, {{ structure.city }}</span
                >
              </div>
              <div class="relative">
                <h3 class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                  <a>
                    <span class="absolute inset-0"></span>
                    {{ structure.name }}
                  </a>
                </h3>

                <div class="flex flex-col mt-5 gap-y-2">
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ structure.email }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ structure.telephone }}
                  </div>
                  <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                    {{ structure.website }}
                  </div>
                </div>
              </div>
              <div class="relative mt-8 flex items-center gap-x-4">
                <a
                  class="flex flex-row items-center justify-center col-span-1 rounded-lg p-3 w-full cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]"
                  (click)="store.choose(structure._id)"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </a>
              </div>
            </div>
          </article>
          } @placeholder {
          <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[34rem]">
            <loader></loader>
          </div>
          } @loading {
          <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[34rem]">
            <loader></loader>
          </div>
          } }
        </div>
        } @case('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @default {
        <ng-container *ngTemplateOutlet="empty"></ng-container>
        } }
      </div>
    </div>

    <footer class="bg-zinc-50 dark:bg-zinc-900">
      <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div class="pb-6">
            <a
              (click)="userPanelUI.togglePanel()"
              class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >{{ 'MY_PROFILE' | translate }}</a
            >
          </div>
          <div class="pb-6">
            <a
              (click)="settingsUI.openDialog()"
              class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >{{ 'SETTINGS' | translate }}</a
            >
          </div>
          <div class="pb-6">
            <a
              class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              href="mailto:support@eddy.restaurant"
              >{{ 'HELP' | translate }}</a
            >
          </div>
        </nav>

        <p class="mt-10 text-center text-xs leading-5 text-zinc-500">
          &copy; {{ currentYear }} Diamonds Consulting, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class StructuresComponent {
  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  restaurantPanelUI = inject(RestaurantPanelService);
  store = inject(StructureStore);

  searchFormControl = new FormControl('');
  showSearch = signal(false);
  currentYear = moment(new Date()).year();

  constructor() {
    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.store.search$.next(value));
  }
}
