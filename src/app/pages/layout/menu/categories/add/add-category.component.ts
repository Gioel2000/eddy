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
          class="relative transform overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
          [ngClass]="{
            'opacity-100 translate-y-0 sm:scale-100': dialog.isDialogVisible(),
            'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !dialog.isDialogVisible()
          }"
          (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
        >
          <div class="flex flex-row items-center justify-between mb-8">
            <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'ADD_CATEGORY' | translate }}
            </span>

            <button
              type="button"
              class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
              (click)="dialog.closeDialog()"
            >
              <span class="svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
            </button>
          </div>

          <form class="w-full">
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
                      [formControl]="nameControl"
                      autocomplete="given-name"
                      class="block w-full rounded-md border-0 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent sm:text-sm sm:leading-6"
                      placeholder="{{ 'CATEGORIES_DESCRIPTION' | translate }}"
                    />
                  </div>
                </div>

                <div class="col-span-full">
                  <div>
                    <div class="flex items-center justify-between">
                      <h2 class="text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        {{ 'ICON' | translate }}
                      </h2>
                    </div>

                    <fieldset class="mt-2">
                      <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        @for (icon of icons.slice(start(), end()); track $index) {
                        <label
                          class="flex items-center justify-center rounded-lg py-3 px-3 text-sm font-semibold uppercase sm:flex-1 cursor-pointer focus:outline-none "
                          [ngClass]="{
                            'bg-accent text-white cursor-pointer shadow-[shadow:inset_0_2px_theme(colors.white/40%)] dark:shadow-[shadow:inset_0_1.5px_theme(colors.black/40%)] ring-1 ring-inset ring-accent': iconSelected() === icon,
                            'text-zinc-900 dark:text-zinc-100 cursor-pointer': iconSelected() !== icon,
                          }"
                          (click)="iconSelected.set(icon)"
                        >
                          <input type="radio" class="sr-only" value="4 GB" />
                          <div class="flex flex-col items-center gap-y-2">
                            <span class="svg-icon-3 stroke-2" [inlineSVG]="'food/' + icon"></span>
                            <span class="text-center text-xs capitalize opacity-50">{{
                              icon | replace : '.svg' : '' | replace : '-' : ' '
                            }}</span>
                          </div>
                        </label>
                        }
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="flex flew-row items-end w-full">
            <span class="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                class="relative inline-flex items-center rounded-l-md bg-zinc-50 dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700/50 focus:z-10"
                [disabled]="start() === 0"
                (click)="prev()"
              >
                <span class="svg-icon-8" inlineSVG="arrow-left.svg"></span>
              </button>
              <button
                type="button"
                class="relative -ml-px inline-flex items-center rounded-r-md bg-zinc-50 dark:bg-zinc-800 px-2 py-2 text-zinc-400 dark:text-zinc-600 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700/50 focus:z-10"
                [disabled]="end() >= icons.length"
                (click)="next()"
              >
                <span class="svg-icon-8" inlineSVG="arrow-right.svg"></span>
              </button>
            </span>
          </div>
          <button
            class="flex flex-row items-center justify-center col-span-1 rounded-lg mt-12 p-2 w-full cursor-pointer ring-1 ring-inset ring-accent bg-gradient-to-t from-accent to-accent/70 hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
            [disabled]="!nameControl.valid || !iconSelected()"
            (click)="done()"
          >
            <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
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
  nameControl = new FormControl('', [Validators.required]);
  iconSelected = signal('');
  iconsPerPage = 16;
  start = signal(0);
  end = signal(16);

  constructor() {
    toObservable(this.dialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const mode = this.menu.categoryMode();

        this.start.set(0);
        this.end.set(16);

        if (mode === 'edit') {
          const { icon, name } = this.menu.category();
          this.iconSelected.set(icon);
          this.nameControl.setValue(name);
        }

        if (mode === 'add') {
          this.iconSelected.set('');
          this.nameControl.reset();
        }
      });
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
    const mode = this.menu.categoryMode();

    if (mode === 'add') {
      this.dialog.closeDialog();
      this.store.addCategory({
        name: this.nameControl.value!,
        icon: this.iconSelected(),
      });
      this.iconSelected.set('');
      this.nameControl.reset();
    }

    if (mode === 'edit') {
      this.dialog.closeDialog();
      this.store.editCategory({
        _id: this.menu.category()._id,
        name: this.nameControl.value!,
        icon: this.iconSelected(),
      });
      this.iconSelected.set('');
      this.nameControl.reset();
    }
  }
}
