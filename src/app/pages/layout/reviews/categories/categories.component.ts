import { Component, ElementRef, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsService } from '../reviews.service';

@Component({
  selector: 'categories-dropdown',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ClickOutsideDirective, TranslateModule, ReactiveFormsModule],
  template: ` <div
    class="sm:min-w-36 w-full border-none md:border-l border-zinc-300 dark:border-zinc-700/50"
    (clickOutside)="dropdown.close()"
  >
    <div class="relative">
      <label
        for="name"
        class="absolute -top-2 left-2 inline-block bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >{{ 'CATEGORIES' | translate }}</label
      >
      <button
        #buttonElement
        type="button"
        class="block w-full ring-1 ring-zinc-300 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
        [ngClass]="{
          'ring-2 ring-accent dark:ring-accentDark': checked(),
          'ring-1 ring-zinc-300 dark:ring-zinc-800': !checked()
        }"
        (click)="dropdown.toggle()"
      >
        <div class="flex flex-row items-center justify-between">
          <span class="truncate max-w-28 md:max-w-full xl:max-w-24 capitalize">{{
            checked() || ('NO_CATEGORIES' | translate)
          }}</span>
          <span
            [inlineSVG]="'chevron-down.svg'"
            class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
          ></span>
        </div>
      </button>
      <div [ngClass]="{ hidden: !dropdown.isOpen() }">
        <div
          class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-900 dark:ring-zinc-700 ring-opacity-5 focus:outline-none transition ease-out duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          [ngClass]="{
            'opacity-100 scale-100': dropdown.isVisible(),
            'opacity-0 scale-90': !dropdown.isVisible(),
            'left-0 origin-top-left ': direction() === 'left',
            'right-0 origin-top-right': direction() === 'right'
          }"
        >
          <div class="py-2 px-3" role="none">
            <fieldset>
              <div class="space-y-3">
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="food()"
                    (change)="toggle('restaurant_food')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'pizza-slice-2.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'REVIEWS_CATEGORIES.RESTAURANT_FOOD.DESC' | translate
                    }}</span>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="atmosphere()"
                    (change)="toggle('restaurant_atmosphere')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'portal-sparkle.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'REVIEWS_CATEGORIES.RESTAURANT_ATMOSPHERE.DESC' | translate
                    }}</span>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="service()"
                    (change)="toggle('restaurant_service')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'food-delivery-time.svg'"
                      class="svg-icon svg-icon-6 text-zinc-800 dark:text-zinc-200 stroke-[1.7]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-800 dark:text-zinc-200">{{
                      'REVIEWS_CATEGORIES.RESTAURANT_SERVICE.DESC' | translate
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
export class CategoriesDropdownComponent {
  @ViewChild('buttonElement', { read: ElementRef }) buttonElement: ElementRef | undefined;

  dropdown = inject(DropdownService);
  reviews = inject(ReviewsService);
  translate = inject(TranslateService);

  checked = computed(() =>
    this.reviews
      .filter()
      .sentimentCategories.map((cat) => this.translate.instant(`REVIEWS_CATEGORIES.${cat.toUpperCase()}.DESC`))
      .join(', ')
  );

  food = computed(() => this.reviews.filter().sentimentCategories.includes('restaurant_food'));
  atmosphere = computed(() => this.reviews.filter().sentimentCategories.includes('restaurant_atmosphere'));
  service = computed(() => this.reviews.filter().sentimentCategories.includes('restaurant_service'));

  direction = signal<'left' | 'right'>('left');

  constructor() {
    setTimeout(() => {
      const { innerWidth: windowWidth } = window;
      const { right } = this.buttonElement?.nativeElement.getBoundingClientRect();

      this.direction.set(right > windowWidth / 2 ? 'right' : 'left');
    }, 0);
  }

  toggle(category: string) {
    const sentimentCategories = this.reviews.filter().sentimentCategories;
    const thereIsCategory = sentimentCategories.includes(category);

    this.reviews.filter.set({
      ...this.reviews.filter(),
      sentimentCategories: thereIsCategory
        ? sentimentCategories.filter((cat) => cat !== category)
        : [...sentimentCategories, category],
      offset: 0,
    });
  }
}
