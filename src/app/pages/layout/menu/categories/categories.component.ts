import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MenuStoreService } from '../../../../store/menu/menu.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { CommonModule } from '@angular/common';
import { DialogService } from './add/dialog.service';
import { CategoryTO } from '../../../../store/menu/interfaces/menu';
import { MenuService } from '../menu.service';
import { GeneralDialogService } from '../../../../ui/dialog/dialog.service';

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
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="grid gap-3 grid-cols-4 sm:grid-cols-4 md:grid-cols-6 2xl:grid-cols-8">
      @for (category of store.categories(); track $index) {
      <span
        class="flex flex-row items-center justify-between rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-200 shadow-sm ring-1  ring-zinc-200 dark:ring-zinc-800 hover:shadow cursor-pointer"
      >
        <div
          class="flex flex-row items-center w-[calc(80%_-_20px)] cursor-pointer h-full ml-1 p-1"
          (click)="onEdit(category)"
        >
          <span class="truncate">{{ category.name }}</span>
        </div>
        <button
          type="button"
          class="group relative rounded p-1 m-1 w-[25px] hover:bg-zinc-500/20 dark:hover:bg-zinc-700/20 focus:outline-none transition ease-in-out duration-100"
          (click)="onDelete(category)"
        >
          <span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="trash.svg"></span>
        </button>
      </span>
      }

      <a
        class="inline-flex items-center gap-x-2 rounded-md p-1 text-sm font-medium text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 cursor-pointer"
        (click)="onAdd()"
      >
        <span class="svg-icon svg-icon-9 stroke-[1.8] ml-1" inlineSVG="plus.svg"></span>
        <div class="w-full">{{ 'NEW' | translate }}</div>
      </a>
    </div>
  `,
})
export class MenuCategoriesComponent {
  store = inject(MenuStoreService);
  dialog = inject(DialogService);
  menu = inject(MenuService);
  generalDialog = inject(GeneralDialogService);

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

  onDelete(category: CategoryTO) {
    this.generalDialog.title.set(category.name);
    this.generalDialog.descriptioni18n.set('DELETE_CATEGORY_CONFIRM');
    this.generalDialog.mode.set('boolean');
    this.generalDialog.fuction.set(() => this.store.deleteCategory(category._id));
    this.generalDialog.openDialog();
  }
}
