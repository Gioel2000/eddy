import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { MenuStoreService } from '../../../../store/menu/menu.service';
import { DialogService } from '../categories/add/dialog.service';
import { MenuService } from '../menu.service';

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
      <div class="flex">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'MENUS' | translate }}
          </h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'MENU_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="mt-4 ml-8 flex-none">
          @if (store.dishesState() === 'loaded') {
          <a
            class="flex flex-row items-center justify-center rounded-full p-2 w-full h-auto cursor-pointer ring-1 ring-inset ring-zinc-800 dark:ring-zinc-100 bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200 text-white dark:text-black shadow-[shadow:inset_0_1.8px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_1.5px_theme(colors.black/40%)]"
          >
            <span [inlineSVG]="'plus.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
          </a>
          }
        </div>
      </div>
      <div>
        @switch(store.menusState()) { @case('loaded') { ciao } @case('loading') {
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
}
