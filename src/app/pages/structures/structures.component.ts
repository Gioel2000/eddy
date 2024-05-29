import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
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
import { map } from 'rxjs';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'choose-restaurant',
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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="bg-zinc-50 dark:bg-[#141414] py-12 sm:py-24 min-h-screen">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="pb-12">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-bold">
            <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
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
                (click)="showSearch()"
              >
                <span [inlineSVG]="'magnifier.svg'" class="svg-icon svg-icon svg-icon-3 stroke-2"></span>
              </a>
              <button
                id="open-create-restaurant-panel"
                class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-[#1A1A1A] text-white bg-gradient-to-b from-black/55 via-[#1A1A1A] to-[#1A1A1A] dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/25 disabled:opacity-30"
                (click)="restaurantPanelUI.openPanel()"
              >
                <div
                  class="flex flex-row items-center justify-center gap-x-2 bg-[#1A1A1A] p-3 rounded-[9998px] cursor-pointer"
                >
                  <span
                    class="svg-icon svg-icon-3 stroke-2 text-zinc-100 dark:text-zinc-100"
                    [inlineSVG]="'plus.svg'"
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            class="mt-16"
            [ngClass]="{
              hidden: !isSearchVisible(),
              block: isSearchVisible()
            }"
          >
            <div class="relative mt-2 rounded-[10px] shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span
                  [inlineSVG]="'magnifier.svg'"
                  class="svg-icon svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600"
                ></span>
              </div>
              <input
                #searchControl
                type="text"
                class="block w-full rounded-[10px] border-0 dark:bg-zinc-900 py-3.5 pl-10 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                placeholder="{{ 'SEARCH' | translate }}..."
                [formControl]="searchFormControl"
              />
            </div>
          </div>
        </div>
        @switch(store.state()) { @case('loaded') {
        <div
          id="loaded"
          class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          @for (structure of store.structures(); track $index) { @defer (on viewport; prefetch on idle) {
          <article
            class="flex flex-col items-start justify-between rounded-2xl bg-white dark:bg-[#1a1a1a] ring-1 ring-inset ring-zinc-300 dark:ring-[#2f2f2f]"
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
              <div
                class="bg-accent dark:bg-accentDark rounded-lg relative mt-8 flex items-center gap-x-4 opacity-90 hover:opacity-100 transition ease-in-out duration-200"
              >
                <button
                  [id]="'choose-structure-' + structure._id"
                  class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] w-full h-full ring-1 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-white/40 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/20 hover:shadow-black/30 disabled:opacity-30"
                  (click)="store.choose(structure._id)"
                >
                  <div
                    class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
                  >
                    <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                  </div>
                </button>
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

    <footer class="bg-zinc-50 dark:bg-[#111]">
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
  @ViewChild('searchControl') searchControl!: ElementRef;

  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  restaurantPanelUI = inject(RestaurantPanelService);
  store = inject(StructureStore);

  searchFormControl = new FormControl('');
  isSearchVisible = signal(false);
  currentYear = moment(new Date()).year();

  constructor() {
    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.store.search$.next(value));
  }

  showSearch() {
    this.searchFormControl.reset();

    if (this.isSearchVisible()) {
      this.isSearchVisible.set(false);
      return;
    }

    this.isSearchVisible.set(true);

    setTimeout(() => {
      const inputElement = this.searchControl.nativeElement as HTMLInputElement;
      inputElement.focus();
    }, 0);
  }
}
