import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { GeneralDialogService } from './dialog.service';

@Component({
  selector: 'general-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective],
  template: `
    <div
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
            class="relative transform overflow-hidden rounded-xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
            [ngClass]="{
              'opacity-100 translate-y-0 sm:scale-100': dialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !dialog.isDialogVisible()
            }"
            (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
          >
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
                (click)="dialog.closeDialog()"
              >
                <span class="svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
              </button>
            </div>
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100" id="modal-title">
                  {{ dialog.title() }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-zinc-500">
                    {{ dialog.descriptioni18n() | translate }}
                  </p>
                </div>
              </div>
            </div>
            @switch (dialog.mode()) { @case ('boolean') {
            <div class="mt-8 sm:flex gap-x-3">
              <button
                type="button"
                class="inline-flex w-full justify-center rounded-md min-w-10 bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                (click)="dialog.fuction()(); dialog.closeDialog()"
              >
                {{ 'YES' | translate }}
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md min-w-10 bg-transparent px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 sm:mt-0 sm:w-auto"
                (click)="dialog.closeDialog()"
              >
                {{ 'NO' | translate }}
              </button>
            </div>
            } }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GeneralDialogComponent {
  dialog = inject(GeneralDialogService);
}
