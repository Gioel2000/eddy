import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddCompetitorDialogService } from './add-competitor-dialog.service';
import { Step1CompetitorDialog } from './step1/step1.component';
import { Step2CompetitorDialog } from './step2/step2.component';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { MissingTranslationPipe } from '../../utils/pipes/missingTranslation.pipe';
import { CompetitorsStore } from '../../store/competitors/competitors.service';

@Component({
  selector: 'add-competitor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ClickOutsideDirective,
    MissingTranslationPipe,
    Step1CompetitorDialog,
    Step2CompetitorDialog,
  ],
  template: `
    <div
      class="relative z-[60]"
      [ngClass]="{
        hidden: dialog.isAllowed() && !dialog.isDialogOpen(),
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
              'opacity-100 translate-y-0 sm:scale-100': dialog.isAllowed() && dialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': dialog.isAllowed() && !dialog.isDialogVisible()
            }"
            (clickOutside)="dialog.isAllowed() && dialog.isDialogVisible() && dialog.closeDialog()"
          >
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100 animate-blurToClear100"
                (click)="dialog.closeDialog()"
              >
                <span class="svg-icon svg-icon-8 stroke-[1.6]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="14"
                        y1="4"
                        x2="4"
                        y2="14"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-color="color-2"
                      ></line>
                      <line
                        x1="4"
                        y1="4"
                        x2="14"
                        y2="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                    </g>
                  </svg>
                </span>
              </button>
            </div>
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100" id="modal-title">
                  {{ 'ADD_COMPETITOR' | translate }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-zinc-500 w-full sm:w-4/5">{{ 'ADD_COMPETITOR_DIALOG' | translate }}</p>
                </div>
                @switch (store.step()) { @case(1) {<step1-competitor-dialog></step1-competitor-dialog>} @case(2)
                {<step2-competitor-dialog></step2-competitor-dialog>} }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AddCompetitorDialogComponent {
  dialog = inject(AddCompetitorDialogService);
  store = inject(CompetitorsStore);
}
