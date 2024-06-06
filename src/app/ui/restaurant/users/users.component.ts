import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LoaderComponent } from '../../loader/loader.component';
import { RestaurantPanelService } from '../panel.service';
import { UsersStore } from '../../../store/users/users.service';
import { UserService } from '../user/user.service';

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-users',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ReactiveFormsModule, LoaderComponent, InlineSVGModule],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[24rem] sm:h-[54rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="flex flex-col px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center">
        <div class="flex-auto">
          <h1 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{{ 'USERS' | translate }}</h1>
          <p class="mt-2 text-sm text-zinc-500">
            {{ 'USERS_DESCRIPTION' | translate }}
          </p>
        </div>
        <div class="ml-16 flex-none">
          <div class="flex flex-row mt-2 ml-8 flex-none">
            <a
              id="open-dialog-user"
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
              (click)="openForm()"
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
          </div>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle">
            @if (store.state() === 'loaded' || store.state() === 'empty') {
            <table class="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
              @if (store.users().length > 0) {
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6 lg:pl-8"
                  >
                    {{ 'NAME' | translate }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {{ 'SURNAME' | translate }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {{ 'EMAIL' | translate }}
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                    <span class="sr-only">{{ 'EDIT' | translate }}</span>
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                    <span class="sr-only">{{ 'DELETE' | translate }}</span>
                  </th>
                </tr>
              </thead>
              }
              <tbody id="user-list" class="divide-y divide-zinc-300 dark:divide-zinc-700">
                @for (user of store.users(); track $index) {
                <tr>
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6 lg:pl-8"
                  >
                    {{ user.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">{{ user.surname }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">{{ user.email }}</td>
                  <td class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                    <a
                      (click)="patchForm(user._id, user)"
                      class="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
                      ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="pen-2.svg"></span
                    ></a>
                  </td>
                  <td class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
                    <a (click)="onDelete(user._id)" class="text-red-600 hover:text-red-900 dark:hover:text-red-100"
                      ><span class="svg-icon svg-icon-6 stroke-[1.8]" inlineSVG="trash.svg"></span
                    ></a>
                  </td>
                </tr>
                }
              </tbody>
            </table>
            } @if (store.state() === 'loading') {
            <ng-container *ngTemplateOutlet="loading"></ng-container>
            } @if (store.state() === 'error') {
            <ng-container *ngTemplateOutlet="error"></ng-container>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UsersRestaurantPanelComponent {
  panelUI = inject(RestaurantPanelService);
  store = inject(UsersStore);
  userUI = inject(UserService);

  patchForm(id: string, form: { name: string; surname: string; email: string }) {
    this.userUI.id.set(id);
    this.userUI.mode.set('edit');
    this.userUI.formGroup.get('email')!.disable();
    this.userUI.formGroup.patchValue(form);
    this.userUI.dialog.openDialog();
  }

  openForm() {
    this.userUI.mode.set('create');
    this.userUI.formGroup.get('email')!.enable();
    this.userUI.formGroup.reset();
    this.userUI.dialog.openDialog();
  }

  onDelete(id: string) {
    this.panelUI.isAllowed.set(false);
    this.store.delete(id);
    setTimeout(() => this.panelUI.isAllowed.set(true), 0);
  }
}
