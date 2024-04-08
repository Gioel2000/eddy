import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { MenuStoreService } from '../../../../store/menu/menu.service';
import { DialogService } from './add/dialog.service';
import { MenuService } from '../menu.service';
import { DishComponent } from './dish/dish.component';
import { DishTO } from '../../../../store/menu/interfaces/menu';

@Component({
  selector: 'menu-dishes',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, LoaderComponent, DishComponent],
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

    <div class="flex flex-col gap-y-8 h-full">
      <div class="flex">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'DISHES' | translate }}
          </h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'DISHES_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="mt-4 ml-8 flex-none">
          @if (store.categoriesState() === 'loaded') {
          <a
            class="flex flex-row items-center justify-center rounded-full p-2 w-full h-auto cursor-pointer ring-1 ring-inset ring-zinc-800 dark:ring-zinc-100 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-black shadow-[shadow:inset_0_1.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_1.5px_theme(colors.black/40%)]"
            (click)="onAdd()"
          >
            <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
          </a>
          }
        </div>
      </div>
      <div>
        @switch(store.dishesState()) { @case('loaded') {
        <div class="flex flex-col gap-y-6">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full sm:w-auto sm:max-w-full gap-y-6">
            @defer (on viewport; prefetch on idle) { @for (dish of store.dishes(); track $index) {
            <menu-dish
              class="h-full"
              [dish]="dish"
              [categories]="store.categories()"
              (edit)="editDish($event)"
              (delete)="deleteDish($event)"
            ></menu-dish>
            } } @placeholder {
            <div></div>
            } @loading {
            <div></div>
            }
          </div>
        </div>
        } @case('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @case('empty') {
        <ng-container *ngTemplateOutlet="empty"></ng-container>
        } }
      </div>
    </div>
  `,
})
export class MenuDishesComponent {
  store = inject(MenuStoreService);
  dialog = inject(DialogService);
  menu = inject(MenuService);

  onAdd() {
    this.menu.dishMode.set('add');
    this.menu.dish.set({} as any);
    this.dialog.openDialog();
  }

  editDish(dish: DishTO) {
    this.menu.dishMode.set('edit');
    this.menu.dish.set(dish);
    this.dialog.openDialog();
  }

  deleteDish(dish: DishTO) {
    this.store.deleteDish(dish._id);
  }
}
