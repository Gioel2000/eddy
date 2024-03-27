import { Component, QueryList, Renderer2, ViewChildren, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, tap } from 'rxjs';
import { PublicMenuStoreService } from '../../store/public-menu/public-menu.service';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MoneyPipe } from '../../utils/pipes/money.pipe';
import { DishComponent } from './dish/dish.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { Category, Dish } from '../../store/public-menu/interface/public-menu';
import moment from 'moment';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownService } from './dropdown.service';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { DishDialogComponent } from './dish-dialog/dish-dialog.component';
import { DialogService } from './dish-dialog/dialog.service';

@UntilDestroy()
@Component({
  selector: 'public-menu',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    InlineSVGModule,
    TranslateModule,
    MoneyPipe,
    ReactiveFormsModule,
    DishComponent,
    ClickOutsideDirective,
    DishDialogComponent,
  ],
  template: `
    <dish-dialog [dish]="selectedDish()" [currentLang]="translate.currentLang"></dish-dialog>

    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-row items-center justify-center w-full h-screen">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px- py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span class="svg-icon-1 text-red-500 stroke-[1.7]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <title>triangle-warning</title>
              <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor">
                <path
                  d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z"
                ></path>
                <line x1="9" y1="6.5" x2="9" y2="10"></line>
                <path
                  d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                  fill="currentColor"
                  data-stroke="none"
                  stroke="none"
                ></path>
              </g>
            </svg>
          </span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="h-full w-full bg-zinc-500/5 dark:bg-zinc-900/5">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8 py-5">
        @switch(publicMenu.state()) { @case('loaded') {
        <div class="h-full px-6 sm:px-2">
          <div
            #header
            id="header"
            class="fixed top-0 left-0 right-0 z-10 ring-1 ring-inset bg-zinc-900 ring-zinc-800 dark:ring-zinc-900 shadow-md"
          >
            <div
              [ngClass]="{ hidden: !showImage(), block: showImage() }"
              class="relative flex h-44 w-full flex-col overflow-hidden"
            >
              <span aria-hidden="true" class="absolute inset-0">
                <img
                  [src]="publicMenu.menu().restaurant.image"
                  alt=""
                  class="h-full w-full object-cover object-center"
                />
              </span>
              <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-900"></span>
            </div>
            <div class="mx-auto max-w-7xl px-6 sm:px-8 xl:px-10 sm:py-6 lg:py-8 py-8 xl:py-10">
              <div>
                <p class="flex items-baseline gap-x-1">
                  <span class="text-4xl font-bold tracking-tight text-white line-clamp-2">{{
                    publicMenu.menu().restaurant.name
                  }}</span>
                </p>
                <p class="text-sm leading-6 text-zinc-300 line-clamp-1">
                  {{ publicMenu.menu().name }}
                  @if (publicMenu.menu().description) {
                  <span class="text-zinc-500">—</span>
                  }
                  {{ publicMenu.menu().description }}
                </p>
              </div>
              <div class="mt-6">
                <div class="sm:hidden">
                  <div
                    class="min-w-36 w-full border-none md:border-l border-zinc-700/50"
                    (clickOutside)="dropdown.close()"
                  >
                    <div class="relative">
                      <button
                        type="button"
                        class="block w-full ring-1 ring-inset ring-zinc-700/50 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-dark text-zinc-300 shadow-sm placeholder:text-zinc-600 text-sm leading-6"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        (click)="dropdown.toggle()"
                      >
                        <div class="flex flex-row items-center justify-between">
                          <span class="truncate max-w-full sm:max-w-24 capitalize">{{
                            selectedCategory().category.name
                          }}</span>
                          <span class="svg-icon-8 text-zinc-400 stroke-[1.8]">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                              <title>chevron down</title>
                              <g fill="currentColor" class="nc-icon-wrapper">
                                <polyline
                                  points="15.25 6.5 9 12.75 2.75 6.5"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></polyline>
                              </g>
                            </svg>
                          </span>
                        </div>
                      </button>
                      <div [ngClass]="{ hidden: !dropdown.isOpen() }">
                        <div
                          class="absolute left-0 z-10 mt-2 w-full origin-top rounded-lg bg-zinc-800 shadow-lg ring-1 ring-zinc-700 ring-opacity-5 focus:outline-none transition ease-out duration-200"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                          tabindex="-1"
                          [ngClass]="{
                            'opacity-100 scale-100': dropdown.isVisible(),
                            'opacity-0 scale-90': !dropdown.isVisible()
                          }"
                        >
                          <div class="p-3" role="none">
                            <fieldset>
                              <div class="space-y-2">
                                @for (category of categories(); track $index) {
                                <div
                                  class="flex flex-row items-center gap-x-1 rounded-md p-2 text-sm font-bold leading-6 cursor-pointer transition-all transform-gpu ease-in-out duration-300 hover:bg-accent hover:text-white"
                                  [ngClass]="{
                                    'bg-accent text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)]':
                                      selectedCategory().category._id === category.category._id,
                                    'bg-zinc-800 text-zinc-500':
                                      selectedCategory().category._id !== category.category._id
                                  }"
                                  (click)="scrollToCategory(category, header.offsetHeight); dropdown.close()"
                                >
                                  <span class="block text-sm font-bold mr-2 leading-6 cursor-pointer">
                                    {{ category.category.name }}
                                  </span>
                                </div>
                                }
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hidden sm:block">
                  <nav class="flex space-x-4" aria-label="Tabs">
                    @for (category of categories(); track $index) {
                    <a
                      class="rounded-md px-3 py-2 text-sm font-medium transition-all transform-gpu ease-in-out duration-300 cursor-pointer"
                      [ngClass]="{
                        'bg-accent text-white': selectedCategory().category._id === category.category._id,
                        'text-zinc-400 hover:bg-accent hover:text-white':
                          selectedCategory().category._id !== category.category._id
                      }"
                      (click)="scrollToCategory(category, header.offsetHeight)"
                      >{{ category.category.name }}</a
                    >
                    }
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div [style.height.px]="header.offsetHeight"></div>
          <div class="mb-4">
            <div class="relative mt-2 rounded-xl shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>magnifier</title>
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="15.25"
                        y1="15.25"
                        x2="11.285"
                        y2="11.285"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-color="color-2"
                      ></line>
                      <circle
                        cx="7.75"
                        cy="7.75"
                        r="5"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></circle>
                    </g>
                  </svg>
                </span>
              </div>
              <input
                type="text"
                class="block w-full rounded-xl border-0 bg-zinc-100 dark:bg-zinc-900 py-3.5 pl-10 text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300 dark:ring-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                placeholder="{{ 'SEARCH' | translate }}..."
                [formControl]="searchFormControl"
              />
            </div>
          </div>
          @for (category of publicMenu.menu().categories; track $index) {
          <div>
            @if(dishesFromCategory(category.category._id); as dishes) { @if (dishes.length > 0) {
            <div class="py-8">
              <div class="md:flex md:items-center md:justify-between">
                <h2
                  class="text-lg font-bold tracking-tight text-zinc-700 dark:text-zinc-300"
                  [id]="category.category.name"
                >
                  {{ category.category.name }}
                </h2>
              </div>
              <div class="mt-6 p-0.5 pb-3 flex flex-row gap-x-4 overflow-x-auto">
                @for (dish of dishes; track $index) { @defer (on viewport; prefetch on idle) {
                <dish [dish]="dish" [currentLang]="translate.currentLang" (open)="open($event)"></dish>
                } @placeholder {
                <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                } @loading {
                <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                } }
              </div>
            </div>
            } }
          </div>
          }
        </div>
        } @case('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @default {
        <ng-container *ngTemplateOutlet="empty"></ng-container>
        } }
      </div>
      <footer class="bg-zinc-400/5 dark:bg-zinc-600/5 border-t border-zinc-300 dark:border-zinc-800">
        <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-44 lg:px-8">
          <p class="text-center text-xs leading-5 text-zinc-500">&copy; {{ year }} Eddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
})
export class PublicMenuComponent {
  route = inject(ActivatedRoute);
  publicMenu = inject(PublicMenuStoreService);
  translate = inject(TranslateService);
  render = inject(Renderer2);
  dropdown = inject(DropdownService);
  dialog = inject(DialogService);

  year = moment().format('YYYY');
  categories = computed(() => this.publicMenu.menu()?.categories?.sort((a, b) => a.orderNumber - b.orderNumber));
  selectedCategory = signal({} as Category);
  showImage = signal(true);
  selectedDish = signal({} as Dish);
  categoryControl = new FormControl();
  searchFormControl = new FormControl();

  constructor() {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        map((paramMap: ParamMap) => paramMap.get('id')),
        filter((id): id is string => !!id)
      )
      .subscribe((id) => this.publicMenu.menuId$.next(id));

    toObservable(this.categories)
      .pipe(untilDestroyed(this))
      .subscribe((categories) => categories && this.selectedCategory.set(categories[0]));

    this.categoryControl.valueChanges.pipe(untilDestroyed(this)).subscribe((categoryId) => {
      const category = this.publicMenu.menu().categories.find((category) => category.category._id === categoryId);
      if (category) {
        this.scrollToCategory(category, document.getElementById('header')?.offsetHeight || 0);
        this.selectedCategory.set(category);
      }
    });

    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.publicMenu.search$.next(value));
  }

  dishesFromCategory(category: string) {
    return this.publicMenu
      .menu()
      .dishes.filter((dish) => dish.dish.category === category)
      .filter((dish) => dish.dish.show);
  }

  ngAfterViewInit() {
    this.render.listen('window', 'scroll', () => {
      this.showImage.set(window.scrollY < 100);

      const categories = this.publicMenu.menu().categories;
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const header = document.getElementById('header');
      const headerBottom = header?.getBoundingClientRect().bottom || 0;

      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const element = document.getElementById(category.category.name);
        if (element && element.getBoundingClientRect().top - headerHeight <= headerBottom) {
          this.selectedCategory.set(category);
          this.categoryControl.patchValue(category.category._id, { emitEvent: false });
        }
      }
    });
  }

  scrollToCategory(category: Category, headerHeight: number) {
    const element = document.getElementById(category.category.name);
    if (element) {
      window.scrollTo({ top: element.offsetTop - headerHeight - 20, behavior: 'smooth' });
      this.selectedCategory.set(category);
      this.categoryControl.patchValue(category.category._id, { emitEvent: false });
    }
  }

  open(dish: Dish) {
    this.selectedDish.set(dish);
    this.dialog.openDialog();
  }
}
