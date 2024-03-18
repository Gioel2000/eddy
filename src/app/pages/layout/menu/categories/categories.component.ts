import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MenuStoreService } from '../../../../store/menu/menu.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { CommonModule } from '@angular/common';
import { DialogService } from './add/dialog.service';
import { CategoryTO } from '../../../../store/menu/interfaces/menu';
import { MenuService } from '../menu.service';

@Component({
  selector: 'menu-categories',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, LoaderComponent],
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
      <div class="flex items-center">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'CATEGORIES' | translate }}
          </h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'CATEGORIES_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="mt-4 ml-16 flex-none">
          <a
            class="flex flex-row items-center justify-center rounded-full p-2 w-full h-auto cursor-pointer ring-1 ring-inset ring-zinc-800 dark:ring-zinc-100 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-black shadow-[shadow:inset_0_1.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_1.5px_theme(colors.black/40%)]"
            (click)="onAdd()"
          >
            <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
          </a>
        </div>
      </div>
      <div>
        @switch(store.categoriesState()) { @case('loaded') {
        <ul role="list" class="divide-y divide-zinc-200 dark:divide-zinc-800">
          @for (category of store.categories(); track $index) {
          <li class="flex justify-between gap-x-6 py-5">
            <div class="flex flex-row items-center gap-x-2">
              <span
                class="svg-icon-6 stroke-2 text-zinc-900 dark:text-zinc-100"
                [inlineSVG]="'food/' + category.icon"
              ></span>
              <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-zinc-900 dark:tex-zinc-100">{{ category.name }}</p>
              </div>
            </div>
            <div class="flex flex-row items-center">
              <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                <a class="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100" (click)="onEdit(category)"
                  ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="pen-2.svg"></span
                ></a>
              </div>
              <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                <a class="text-red-600 hover:text-red-900 dark:hover:text-red-100" (click)="onDelete(category._id)"
                  ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="trash.svg"></span
                ></a>
              </div>
            </div>
          </li>
          }
        </ul>
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
export class MenuCategoriesComponent {
  store = inject(MenuStoreService);
  dialog = inject(DialogService);
  menu = inject(MenuService);

  onEdit(category: CategoryTO) {
    this.menu.categoryMode.set('edit');
    this.menu.category.set(category);
    this.dialog.openDialog();
  }

  onAdd() {
    this.menu.categoryMode.set('add');
    this.menu.category.set({} as CategoryTO);
    this.dialog.openDialog();
  }

  onDelete(id: string) {
    this.store.deleteCategory(id);
  }
}
