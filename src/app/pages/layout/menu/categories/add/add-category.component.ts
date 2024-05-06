import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../../../../utils/directives/clickoutside';
import { DialogService } from './dialog.service';
import { icons } from './icons';
import { ReplacePipe } from '../../../../../utils/pipes/replace.pipe';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuStoreService } from '../../../../../store/menu/menu.service';
import { MenuService } from '../../menu.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'add-category-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, ReplacePipe, ReactiveFormsModule],
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
              {{ menu.categoryMode() === 'edit' ? ('EDIT_CATEGORY' | translate) : ('ADD_CATEGORY' | translate) }}
            </span>

            <button
              type="button"
              class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
              (click)="dialog.closeDialog()"
            >
              <span class="svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-x-8 gap-y-10 pb-4 md:grid-cols-2">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div class="col-span-full">
                <label class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                  'NAME' | translate
                }}</label>
                <div class="mt-2">
                  <input
                    type="text"
                    [formControl]="nameControl"
                    autocomplete="given-name"
                    class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                    placeholder="{{ 'CATEGORIES_DESCRIPTION' | translate }}"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 mt-6 mb-1 xl:col-span-1 rounded-xl w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/30"
            [disabled]="!nameControl.valid"
            (click)="done()"
          >
            <div
              class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[11px] cursor-pointer"
            >
              <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export class AddCategoryComponent {
  dialog = inject(DialogService);
  store = inject(MenuStoreService);
  menu = inject(MenuService);

  icons = icons;
  nameControl = new FormControl('', [Validators.required, Validators.maxLength(200)]);

  constructor() {
    toObservable(this.dialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const mode = this.menu.categoryMode();

        if (mode === 'edit') {
          const { name } = this.menu.category();
          this.nameControl.setValue(name);
        }

        if (mode === 'add') {
          this.nameControl.reset();
        }
      });
  }

  done() {
    const mode = this.menu.categoryMode();

    if (mode === 'add') {
      this.dialog.closeDialog();
      this.store.addCategory({
        name: this.nameControl.value!,
      });
      this.nameControl.reset();
    }

    if (mode === 'edit') {
      this.dialog.closeDialog();
      this.store.editCategory({
        _id: this.menu.category()._id,
        name: this.nameControl.value!,
      });
      this.nameControl.reset();
    }
  }
}
