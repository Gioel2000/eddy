import { Component, inject, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { StructureUIService } from './structure.service';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { StructureStore } from '../../store/structures/structure.service';
import { LoaderComponent } from '../loader/loader.component';
import { RestaurantPanelService as CreateRestaurantService } from '../create-restaurant/create-restaurant.service';
import { RestaurantPanelService } from '../restaurant/panel.service';
import { MissingTranslationPipe } from '../../utils/pipes/missingTranslation.pipe';

@UntilDestroy()
@Component({
  selector: 'structure-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ClickOutsideDirective,
    LoaderComponent,
    ReactiveFormsModule,
    MissingTranslationPipe,
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-44">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-44">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-44">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div [ngClass]="{ hidden: !ui.isDropdownOpen() }">
      <div
        class="absolute bottom-12 w-56 z-10 my-3 origin-bottom divide-y divide-zinc-200 dark:divide-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg shadow-black/10 ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
        [ngClass]="{
          'opacity-100 scale-100': ui.isDropdownVisible(),
          'opacity-0 scale-90': !ui.isDropdownVisible()
        }"
      >
        <div class="block text-sm cursor-pointer w-full">
          <button
            id="structure-item"
            class="group flex flex-col w-full p-3 cursor-pointer gap-y-0.5 transition-all transform-gpu ease-in-out duration-200"
            (click)="restaurantPanel.togglePanel()"
          >
            <div class="flex flex-row items-start justify-between w-full gap-x-1">
              <div class="flex flex-row items-center gap-x-2">
                <div class="flex flex-col items-start w-full line-clamp-1 text-left">
                  <span
                    class="text-base font-semibold leading-5 text-zinc-700 dark:text-zinc-200 line-clamp-1"
                    aria-hidden="true"
                    >{{ structures.selected().name }}</span
                  >
                  <span class="text-xs font-normal text-zinc-400 dark:text-zinc-600 line-clamp-1" aria-hidden="true"
                    >{{ structures.selected().address }}, {{ structures.selected().city }}</span
                  >
                </div>
              </div>
              <span
                [inlineSVG]="'share-up-right.svg'"
                class="group-hover:text-zinc-700 dark:group-hover:text-zinc-200 w-4 text-zinc-400 dark:text-zinc-600 svg-icon svg-icon-7 stroke-[1.8] transition-all transform-gpu ease-in-out duration-200"
              ></span>
            </div>
          </button>
        </div>
        <div class="px-0.5 py-0.5" role="none">
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
        <ul class="z-10 max-h-44 w-full overflow-y-auto py-1 text-base focus:outline-none sm:text-sm">
          @switch(structures.state()) { @case('loaded') { @for (restaurant of structures.structures(); track $index) {
          <li
            class="text-zinc-700 dark:text-zinc-300 relative cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 select-none py-2 pl-3 pr-9"
            id="listbox-option-0"
            role="option"
            (click)="structures.choose(restaurant._id)"
          >
            <div class="flex items-center">
              <img
                class="h-7 w-7 sm:h-6 sm:w-6 rounded-md object-cover object-center"
                [src]="restaurant.image"
                alt=""
              />
              <span class="text-sm font-medium ml-2 block truncate">{{ restaurant.name }}</span>
            </div>
            @if (structures.selected(); as selected) { @if (selected._id === restaurant._id) {
            <span class="text-zinc-700 dark:text-zinc-300 absolute inset-y-0 right-0 flex items-center pr-4">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            } }
          </li>
          } } @case('loading') {
          <ng-container *ngTemplateOutlet="loading"></ng-container>
          } @case('error') {
          <ng-container *ngTemplateOutlet="error"></ng-container>
          } @default {
          <ng-container *ngTemplateOutlet="empty"></ng-container>
          } }
        </ul>

        <div class="py-2" role="none">
          <a
            class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            (click)="createRestaurantPanel.openPanel()"
          >
            <div class="flex flex-row items-center w-full">
              <span class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300" inlineSVG="plus.svg"></span>
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ 'ADD' | translate }}</span>
            </div>
          </a>
          <a
            class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            (click)="structures.exit(); restaurantPanel.closePanel()"
          >
            <div class="flex flex-row items-center w-full">
              <span
                class="mr-2 svg-icon-6 stroke-[1.6] text-zinc-700 dark:text-zinc-300"
                inlineSVG="arrows-diagonal-opposite-direction.svg"
              ></span>
              <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ 'CHANGE' | translate }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    @switch (structures.selectedState()) { @case ('loaded') { @if (structures.selected(); as structureSelected) {
    <button
      type="button"
      class="flex items-center p-2 hover:bg-zinc-600/5 dark:hover:bg-zinc-300/5 rounded-lg w-56"
      id="user-menu-button"
      aria-expanded="false"
      aria-haspopup="true"
      [ngClass]="{
        'bg-zinc-600/5 dark:bg-zinc-300/5': ui.isDropdownOpen(),
      }"
      (click)="ui.toggleDropdown()"
      (clickOutside)="isSearchBlur() && ui.closeDropdown()"
    >
      <div class="flex flex-row items-center justify-between w-full gap-x-2">
        <div class="flex flex-row items-center gap-x-2">
          <img class="h-9 w-9 rounded-md object-cover object-center" [src]="structureSelected.image" alt="" />
          <div class="flex flex-col items-start w-full line-clamp-1 text-left">
            <span
              class="text-sm font-semibold leading-5 text-zinc-800 dark:text-zinc-200 line-clamp-1"
              aria-hidden="true"
              >{{ structureSelected.name }}</span
            >
            <span class="text-xs font-normal text-zinc-400 dark:text-zinc-600 line-clamp-1" aria-hidden="true"
              >{{ structureSelected.address }}, {{ structureSelected.city }}</span
            >
          </div>
        </div>
        <span
          class="svg-icon-7 stroke-[1.3] text-zinc-400 dark:text-zinc-600"
          [inlineSVG]="'chevron-expand-y.svg'"
        ></span>
      </div>
    </button>
    } } @case ('loading') {
    <div class="flex flex-row items-center justify-start w-full px-4 py-2">
      <div class="flex flex-row items-center justify-start w-full">
        <loader></loader>
      </div>
    </div>
    } }
  `,
})
export class StructureComponent {
  ui = inject(StructureUIService);
  structures = inject(StructureStore);
  restaurantPanel = inject(RestaurantPanelService);
  createRestaurantPanel = inject(CreateRestaurantService);

  searchFormControl = new FormControl('');
  isSearchBlur = signal(true);

  constructor() {
    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.structures.search$.next(value));
  }
}
