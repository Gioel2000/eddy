import { Component, computed, inject } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsService } from '../reviews.service';

@Component({
  selector: 'types-dropdown',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ClickOutsideDirective, TranslateModule, ReactiveFormsModule],
  template: ` <div
    class="sm:min-w-32 w-full border-none md:border-l border-zinc-200 dark:border-zinc-800"
    (clickOutside)="dropdown.close()"
  >
    <div class="relative">
      <label
        for="name"
        class="absolute -top-2 left-2 inline-block bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >{{ 'CUSTOMER_TYPES' | translate }}</label
      >
      <button
        type="button"
        class="block w-full ring-1  ring-zinc-300 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
        [ngClass]="{
          'ring-2 ring-accent dark:ring-accentDark': checked(),
          'ring-1 ring-zinc-300 dark:ring-zinc-800': !checked()
        }"
        (click)="dropdown.toggle()"
      >
        <div class="flex flex-row items-center justify-between">
          <span class="truncate max-w-28 md:max-w-full xl:max-w-24">{{ checked() || ('ALL_TYPES' | translate) }}</span>
          <span
            [inlineSVG]="'chevron-down.svg'"
            class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
          ></span>
        </div>
      </button>
      <div [ngClass]="{ hidden: !dropdown.isOpen() }">
        <div
          class="absolute z-10 mt-2 w-56 rounded-[10px] bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 left-0 origin-top-left sm:left-0 sm:origin-top-left"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          [ngClass]="{
            'opacity-100 scale-100': dropdown.isVisible(),
            'opacity-0 scale-90': !dropdown.isVisible(),
          }"
        >
          <div class="py-2 px-3" role="none">
            <fieldset>
              <div class="space-y-3">
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsSolo()"
                    (change)="toggle('Solo')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'user.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'SOLO' | translate
                    }}</span>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsFamily()"
                    (change)="toggle('Family')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'crowd.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'FAMILY' | translate
                    }}</span>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsCouple()"
                    (change)="toggle('Couple')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'users-3.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'COUPLE' | translate
                    }}</span>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsBusiness()"
                    (change)="toggle('Business')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'suitcase-6.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'BUSINESS' | translate
                    }}</span>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class TypesDropdownComponent {
  dropdown = inject(DropdownService);
  reviews = inject(ReviewsService);

  checked = computed(() => this.reviews.filter().clients.join(', '));
  thereIsFamily = computed(() => this.reviews.filter().clients.includes('Family'));
  thereIsSolo = computed(() => this.reviews.filter().clients.includes('Solo'));
  thereIsCouple = computed(() => this.reviews.filter().clients.includes('Couple'));
  thereIsBusiness = computed(() => this.reviews.filter().clients.includes('Business'));

  toggle(client: string) {
    const clients = this.reviews.filter().clients;
    const thereIsService = clients.includes(client);

    this.reviews.filter.set({
      ...this.reviews.filter(),
      clients: thereIsService ? clients.filter((channel) => channel !== client) : [...clients, client],
      offset: 0,
    });
  }
}
