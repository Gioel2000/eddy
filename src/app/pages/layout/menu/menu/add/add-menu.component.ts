import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../../../../utils/directives/clickoutside';
import { DialogService } from './dialog.service';
import { ReplacePipe } from '../../../../../utils/pipes/replace.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuStoreService } from '../../../../../store/menu/menu.service';
import { MenuService } from '../../menu.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddMenu, CategoryTO, DishTO, EditMenu } from '../../../../../store/menu/interfaces/menu';
import { MoneyPipe } from '../../../../../utils/pipes/money.pipe';
import { TruncatePipe } from '../../../../../utils/pipes/truncate.pipe';

@UntilDestroy()
@Component({
  selector: 'add-menu-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ClickOutsideDirective,
    ReplacePipe,
    ReactiveFormsModule,
    MoneyPipe,
    TruncatePipe,
  ],
  template: ` <div
    class="relative z-[10000]"
    [ngClass]="{
      hidden: !dialog.isDialogOpen(),
    }"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
          [ngClass]="{
            'opacity-100 translate-y-0 sm:scale-100': dialog.isDialogVisible(),
            'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !dialog.isDialogVisible()
          }"
          (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
        >
          <div class="flex flex-row items-center justify-between mb-8">
            <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'ADD_MENU' | translate }}
            </span>

            <button
              type="button"
              class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
              (click)="dialog.closeDialog()"
            >
              <span class="svg-icon svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
            </button>
          </div>

          <form [formGroup]="formGroup" class="w-full">
            <div class="grid grid-cols-1 gap-x-8 gap-y-10 pb-4 md:grid-cols-2">
              <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div class="col-span-full">
                  <label
                    for="first-name"
                    class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                    >{{ 'NAME' | translate }}</label
                  >
                  <div class="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autocomplete="given-name"
                      formControlName="name"
                      class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                      placeholder="{{ 'MENU_PLACEHOLDER' | translate }}"
                    />
                  </div>
                </div>
                <div class="col-span-full">
                  <label for="about" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                    'DESCRIPTION' | translate
                  }}</label>
                  <div class="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows="3"
                      formControlName="description"
                      class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 placeholder:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                      placeholder="{{ 'MENU_DESCRIPTION_PLACEHOLDER' | translate }}"
                    ></textarea>
                  </div>
                </div>
                <div class="col-span-full">
                  <div class="flex flex-row items-center justify-between">
                    <label for="about" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                      'CATEGORIES' | translate
                    }}</label>
                    <!-- <a
                      class="text-sm font-semibold text-accent dark:text-accentDark hover:underline decoration-2"
                      (click)="addAllCategories()"
                      >{{ 'ADD_ALL_CATEGORIES' | translate }}</a
                    > -->
                  </div>
                  <div class="mt-2">
                    <fieldset class="mt-2">
                      <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        @for (category of store.categories().slice(start(), end()); track $index) {
                        <a
                          class="flex items-center justify-center rounded-lg py-3 px-3 text-sm font-semibold uppercase sm:flex-1 cursor-pointer focus:outline-none text-zinc-900 dark:text-zinc-100 min-h-20 shadow-sm"
                          [ngClass]="{
                            'ring-2 ring-inset ring-accent dark:ring-accent': thereIsThisCategory(category),
                            'ring-1  ring-zinc-300 dark:ring-zinc-700': !thereIsThisCategory(category),
                          }"
                          (click)="
                            thereIsThisCategory(category)
                              ? removeFromMenuCategories(category)
                              : addToMenuCategories(category)
                          "
                        >
                          <input type="radio" class="sr-only" />
                          <div class="flex flex-col items-center gap-y-2">
                            <!-- <span class="svg-icon svg-icon-3 stroke-2" [inlineSVG]="'food/' + category.icon"></span> -->
                            <span
                              class="text-center text-xs capitalize text-zinc-700 dark:text-zinc-300 line-clamp-3"
                              >{{ category.name }}</span
                            >
                          </div>
                        </a>
                        }
                      </div>
                    </fieldset>
                    <div class="flex flew-row items-end w-full mt-4">
                      <span class="isolate inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          class="relative inline-flex items-center rounded-l-md bg-white dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1  ring-zinc-200 dark:ring-zinc-800 focus:z-10"
                          [disabled]="start() === 0"
                          (click)="prev()"
                        >
                          <span class="svg-icon svg-icon-8" inlineSVG="arrow-left.svg"></span>
                        </button>
                        <button
                          type="button"
                          class="relative -ml-px inline-flex items-center rounded-r-md bg-white dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1  ring-zinc-200 dark:ring-zinc-800 focus:z-10"
                          [disabled]="end() >= store.categories().length"
                          (click)="next()"
                        >
                          <span class="svg-icon svg-icon-8" inlineSVG="arrow-right.svg"></span>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                @if (menuCategories().length > 0 && menuDishes().length > 0) {
                <div class="col-span-full">
                  <label for="about" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                    'DISHES' | translate
                  }}</label>
                  <div class="mt-2 flow-root">
                    <div class="overflow-x-auto">
                      <div class="inline-block min-w-full py-2 align-middle">
                        <table class="min-w-full">
                          <tbody class="bg-white dark:bg-zinc-800">
                            @for (category of menuCategories(); track $index) {
                            <tr class="border-t border-zinc-300 dark:border-zinc-700 h-10">
                              <th
                                colspan="4"
                                scope="colgroup"
                                class="bg-zinc-50 dark:bg-zinc-900 py-2 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-3 h-10"
                              >
                                {{ category.name }}
                              </th>
                              <th
                                colspan="1"
                                scope="colgroup"
                                class="flex flex-row items-center gap-x-1 bg-zinc-50 dark:bg-zinc-900 py-2 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-3 h-10"
                              >
                                <a
                                  class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-700"
                                  (click)="moveCategoryUp(category)"
                                  ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="arrow-up.svg"></span
                                ></a>
                                <a
                                  class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-700"
                                  (click)="moveCategoryDown(category)"
                                  ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="arrow-down.svg"></span
                                ></a>
                              </th>
                            </tr>
                            @for (dish of getDishesByCategory(category); track $index) {
                            <tr class="border-t border-zinc-300 dark:border-zinc-700">
                              <td
                                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-3 truncate"
                              >
                                {{ dish.name }}
                              </td>
                              <!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500"></td> -->
                              <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                                {{ dish.description | truncate : 20 }}
                              </td>

                              <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 truncate">
                                {{ dish.price | money : translate.currentLang : dish.currency }}
                              </td>
                              <td
                                class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
                              >
                                <a (click)="removeDishFromMenu(dish)" class="text-accent dark:text-accentDark"
                                  ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="trash.svg"></span
                                ></a>
                              </td>
                              <td
                                class="flex flex-row items-center gap-x-1 whitespace-nowrap px-3 py-4 text-sm text-zinc-500"
                              >
                                <a
                                  lass="text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-700"
                                  (click)="moveDishUp(dish)"
                                  ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="arrow-up.svg"></span
                                ></a>
                                <a
                                  lass="text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-700"
                                  (click)="moveDishDown(dish)"
                                  ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="arrow-down.svg"></span
                                ></a>
                              </td>
                            </tr>
                            } }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </form>
          <button
            class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 mt-6 mb-1 xl:col-span-1 rounded-[10px] w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/30"
            (click)="done()"
          >
            <div
              class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
            >
              <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export class AddMenuComponent {
  dialog = inject(DialogService);
  store = inject(MenuStoreService);
  menu = inject(MenuService);
  translate = inject(TranslateService);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    description: new FormControl('', [Validators.maxLength(2000)]),
  });

  iconsPerPage = 4;
  start = signal(0);
  end = signal(4);

  menuCategories = signal<CategoryTO[]>([]);
  menuDishes = signal<DishTO[]>([]);

  constructor() {
    toObservable(this.dialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const mode = this.menu.menuMode();
        const menu = this.menu.menu();
        const categories = this.store.categories();
        const dishes = this.store.dishes();

        this.start.set(0);
        this.end.set(4);

        if (mode === 'add') {
          this.formGroup.reset();
          this.menuCategories.set([]);
          this.menuDishes.set([]);
        }

        if (mode === 'edit') {
          this.formGroup.get('name')?.setValue(menu.name);
          this.formGroup.get('description')?.setValue(menu.description);
          this.menuCategories.set(
            menu.categories
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((c) => categories.find((category) => category._id === c.category) || ({} as CategoryTO))
          );
          this.menuDishes.set(
            menu.dishes
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((d) => dishes.find((dish) => dish._id === d.dish) || ({} as DishTO))
          );
        }
      });
  }

  getDishesByCategory(category: CategoryTO): DishTO[] {
    return this.menuDishes().filter((d) => d.category === category._id);
  }

  addToMenuCategories(category: CategoryTO) {
    this.menuCategories.set([...this.menuCategories(), category]);
    this.menuDishes.set([...this.menuDishes(), ...this.store.dishes().filter((d) => d.category === category._id)]);
  }

  removeFromMenuCategories(category: CategoryTO) {
    this.menuCategories.set(this.menuCategories().filter((c) => c._id !== category._id));
    this.menuDishes.set(this.menuDishes().filter((d) => d.category !== category._id));
  }

  removeDishFromMenu(dish: DishTO) {
    this.dialog.isAllowed.set(false);
    setTimeout(() => this.dialog.isAllowed.set(true), 0);

    this.menuDishes.set(this.menuDishes().filter((d) => d._id !== dish._id));
  }

  thereIsThisCategory(category: CategoryTO): boolean {
    return this.menuCategories().some((c) => c._id === category._id);
  }

  addAllCategories() {
    this.menuCategories.set(this.store.categories());
  }

  addCategoriesWithDishes() {
    const categoriesWithDishes = this.store.categories().map((category) => ({
      category,
      dishes: this.store.dishes().filter((d) => d.category === category._id),
    }));

    this.menuCategories.set(categoriesWithDishes.filter((c) => c.dishes.length > 0).map((c) => c.category));
  }

  moveCategoryUp(category: CategoryTO) {
    const index = this.menuCategories().findIndex((c) => c._id === category._id);
    const categories = this.menuCategories();

    if (index === 0) return;

    const temp = categories[index - 1];
    categories[index - 1] = category;
    categories[index] = temp;

    this.menuCategories.set(categories);
  }

  moveCategoryDown(category: CategoryTO) {
    const index = this.menuCategories().findIndex((c) => c._id === category._id);
    const categories = this.menuCategories();

    if (index === categories.length - 1) return;

    const temp = categories[index + 1];
    categories[index + 1] = category;
    categories[index] = temp;

    this.menuCategories.set(categories);
  }

  moveDishUp(dish: DishTO) {
    const index = this.menuDishes().findIndex((d) => d._id === dish._id);
    const dishes = this.menuDishes();

    if (index === 0) return;

    const temp = dishes[index - 1];
    dishes[index - 1] = dish;
    dishes[index] = temp;

    this.menuDishes.set(dishes);
  }

  moveDishDown(dish: DishTO) {
    const index = this.menuDishes().findIndex((d) => d._id === dish._id);
    const dishes = this.menuDishes();

    if (index === dishes.length - 1) return;

    const temp = dishes[index + 1];
    dishes[index + 1] = dish;
    dishes[index] = temp;

    this.menuDishes.set(dishes);
  }

  next() {
    this.start.set(this.start() + this.iconsPerPage);
    this.end.set(this.end() + this.iconsPerPage);
  }

  prev() {
    this.start.set(this.start() - this.iconsPerPage);
    this.end.set(this.end() - this.iconsPerPage);
  }

  done() {
    const mode = this.menu.menuMode();

    const categories = this.menuCategories().map((category, index) => ({
      category: category._id,
      orderNumber: index,
    }));

    const dishesOrederedByCategory: {
      dish: string;
      orderNumber: number;
    }[] = categories
      .map((c) => this.menuDishes().filter((d) => d.category === c.category))
      .flat()
      .map((d, index) => ({ dish: d._id, orderNumber: index }));

    if (mode === 'add') {
      const menu: AddMenu = {
        image: '',
        name: this.formGroup.get('name')?.value || '',
        description: this.formGroup.get('description')?.value || '',
        categories: categories,
        dishes: dishesOrederedByCategory,
      };

      this.store.addMenu(menu);
      this.dialog.closeDialog();
      this.formGroup.reset();
      this.menuCategories.set([]);
      this.menuDishes.set([]);
    }

    if (mode === 'edit') {
      const menu: EditMenu = {
        _id: this.menu.menu()._id,
        image: '',
        name: this.formGroup.get('name')?.value || '',
        description: this.formGroup.get('description')?.value || '',
        categories: categories,
        dishes: dishesOrederedByCategory,
      };

      this.store.editMenu(menu);
      this.dialog.closeDialog();
      this.formGroup.reset();
      this.menuCategories.set([]);
      this.menuDishes.set([]);
    }
  }
}
