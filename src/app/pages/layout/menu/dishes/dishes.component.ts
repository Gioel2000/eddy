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
import { MenuCategoriesComponent } from '../categories/categories.component';
import { GeneralDialogService } from '../../../../ui/dialog/dialog.service';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'menu-dishes',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    LoaderComponent,
    DishComponent,
    MenuCategoriesComponent,
    MissingTranslationPipe,
  ],
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
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div class="flex flex-col gap-y-8 h-full">
      <div class="flex flex-row items-start justify-start">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'DISHES' | translate }}
          </h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'DISHES_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="flex flex-row mt-2 ml-8 flex-none">
          @if (store.categoriesState() !== 'empty' && store.categoriesState() !== 'loading') {
          <a
            id="open-add-dish-dialog"
            class="
              col-start-1
              col-span-full
              sm:col-start-2
              sm:col-span-1
              xl:col-span-1
              rounded-[10px]
              h-full
              w-full
              transition
              ease-in-out
              duration-200
              opacity-90
              hover:opacity-100
              ring-1
              dark:ring-0
              ring-[#1A1A1A]
              text-white
              bg-gradient-to-b
              from-black/55
              via-[#1A1A1A]
              to-[#1A1A1A]
              dark:from-white/10
              dark:via-white/5
              dark:to-white/5
              p-px
              shadow-md
              shadow-black/30
            "
            (click)="onAdd()"
          >
            <div
              class="
                flex
                flex-row
                items-center
                justify-center
                gap-x-2
                bg-[#1A1A1A]
                h-full
                w-full
                px-3
                py-2
                rounded-[9px]
                cursor-pointer
              "
            >
              <span class="text-sm font-semibold">{{ 'ADD' | translate }}</span>
              <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon svg-icon-5 stroke-2"></span>
            </div>
          </a>
          }
        </div>
      </div>
      <div>
        <div class="mb-6"><menu-categories></menu-categories></div>
        @switch(store.dishesState()) { @case('loaded') {
        <div class="flex flex-col gap-y-6">
          <div
            class="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full sm:w-auto sm:max-w-full gap-y-6"
          >
            @defer (on viewport; prefetch on idle) { @for (dish of store.dishes(); track $index) {
            <menu-dish
              [dish]="dish"
              [categories]="store.categories()"
              (edit)="editDish($event)"
              (delete)="deleteDish($event)"
              (hide)="hide($event)"
              (show)="show($event)"
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
  generalDialog = inject(GeneralDialogService);

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
    this.generalDialog.title.set(dish.name);
    this.generalDialog.description.set('DELETE_DISH_CONFIRM');
    this.generalDialog.mode.set('boolean');
    this.generalDialog.fuction.set(() => this.store.deleteDish(dish._id));
    this.generalDialog.openDialog();
  }

  hide(dish: DishTO) {
    this.store.visibility(
      {
        ...dish,
        allergens: dish.allergens.join(','),
      },
      false
    );
  }

  show(dish: DishTO) {
    this.store.visibility(
      {
        ...dish,
        allergens: dish.allergens.join(','),
      },
      true
    );
  }
}
