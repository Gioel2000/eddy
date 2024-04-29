import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { MenuStoreService } from '../../../../store/menu/menu.service';
import { MenuService } from '../menu.service';
import { DialogService } from './add/dialog.service';
import { MenuTO } from '../../../../store/menu/interfaces/menu';
import { ShareDialogService } from './share/dialog.service';
import { GeneralDialogService } from '../../../../ui/dialog/dialog.service';

@Component({
  selector: 'menu-menus',
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
      <div class="flex flex-row items-start justify-start">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'MENUS' | translate }}
          </h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'MENU_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="flex flex-row mt-2 ml-8 flex-none">
          @if (store.dishesState() !== 'empty' && store.dishesState() !== 'loading'){
          <a
            class="
              col-start-1
              col-span-full
              sm:col-start-2
              sm:col-span-1
              xl:col-span-1
              rounded-xl
              h-full
              w-full
              transition
              ease-in-out
              duration-200
              opacity-90
              hover:opacity-100
              ring-1
              dark:ring-0
              ring-[#171715]
              text-white
              bg-gradient-to-b
              from-black/55
              via-[#171715]
              to-[#171715]
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
                bg-[#171715]
                h-full
                w-full
                px-3
                py-2
                rounded-[11px]
                cursor-pointer
              "
            >
              <span class="text-sm font-semibold">{{ 'ADD' | translate }}</span>
              <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
            </div>
          </a>
          }
        </div>
      </div>
      <div>
        @switch(store.menusState()) { @case('loaded') {
        <ul role="list" class="divide-y divide-zinc-200 dark:divide-zinc-800">
          @for (menu of store.menus(); track $index) {
          <li class="flex justify-between gap-x-6 py-5">
            <div class="flex flex-row items-center gap-x-2">
              <div class="min-w-0 flex-auto">
                <p class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{{ menu.name }}</p>
                <p class="text-sm font-semibold leading-6 text-zinc-500">{{ menu?.description }}</p>
              </div>
            </div>
            <div class="flex flex-row items-center">
              <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                <a
                  class="text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  (click)="share(menu._id)"
                  ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="connected-dots-3.svg"></span
                ></a>
              </div>
              <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                <a
                  class="text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  (click)="onEdit(menu)"
                  ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="pen-2.svg"></span
                ></a>
              </div>
              <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                <a class="text-red-500 hover:text-red-700 dark:hover:text-red-300" (click)="onDelete(menu)"
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
export class MenusMenuComponent {
  store = inject(MenuStoreService);
  menu = inject(MenuService);
  dialog = inject(DialogService);
  shareDialog = inject(ShareDialogService);
  generalDialog = inject(GeneralDialogService);

  onAdd() {
    this.menu.menuMode.set('add');
    this.menu.menu.set({} as any);
    this.dialog.openDialog();
  }

  onEdit(menu: MenuTO) {
    this.menu.menuMode.set('edit');
    this.menu.menu.set(menu);
    this.dialog.openDialog();
  }

  share(menuId: string) {
    this.shareDialog.openDialog();
    this.menu.menuId.set(menuId);
  }

  onDelete(menu: MenuTO) {
    this.generalDialog.title.set(menu.name);
    this.generalDialog.descriptioni18n.set('DELETE_MENU_CONFIRM');
    this.generalDialog.mode.set('boolean');
    this.generalDialog.fuction.set(() => this.store.deleteMenu(menu._id));
    this.generalDialog.openDialog();
  }
}
