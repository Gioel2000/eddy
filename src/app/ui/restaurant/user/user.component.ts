import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../../store/users/users.service';
import { DialogService } from '../dialog.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoaderComponent } from '../../loader/loader.component';
import { UserPayload } from '../../../store/users/interfaces/users';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';
import { UserService } from './user.service';

@Component({
  selector: 'user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ReactiveFormsModule,
    LoaderComponent,
    ClickOutsideDirective,
  ],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
      hidden: !users.dialog.isDialogOpen(),
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
              'opacity-100 translate-y-0 sm:scale-100': users.dialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !users.dialog.isDialogVisible()
            }"
            (clickOutside)="users.dialog.isDialogVisible() && users.dialog.closeDialog()"
          >
            <div class="flex flex-row items-center justify-between mb-8">
              <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {{ 'USER_CONFIG' | translate }}
              </span>

              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
                (click)="users.dialog.closeDialog()"
              >
                <span class="svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
              </button>
            </div>

            <form [formGroup]="users.formGroup">
              <div class="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-2">
                <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div class="sm:col-span-3">
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
                        autocomplete="given-name"
                        class="block w-full rounded-md border-0 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent sm:text-sm sm:leading-6"
                        placeholder="John"
                        formControlName="name"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-3">
                    <label
                      for="last-name"
                      class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >{{ 'SURNAME' | translate }}</label
                    >
                    <div class="mt-2">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autocomplete="family-name"
                        class="block w-full rounded-md border-0 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent sm:text-sm sm:leading-6"
                        placeholder="Doe"
                        formControlName="surname"
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-4">
                    <label for="email" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                      'EMAIL' | translate
                    }}</label>
                    <div class="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        class="block w-full rounded-md border-0 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent sm:text-sm sm:leading-6 disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
                        placeholder="example@email.com"
                        formControlName="email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <button
              class="flex flex-row items-center justify-center col-span-1 rounded-lg p-2 w-full cursor-pointer ring-1 ring-inset ring-accent bg-gradient-to-t from-accent to-accent/70 hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
              [disabled]="users.formGroup.invalid"
              (click)="users.mode() === 'create' ? users.create() : users.edit()"
            >
              <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserDialogComponent {
  users = inject(UserService);
}
