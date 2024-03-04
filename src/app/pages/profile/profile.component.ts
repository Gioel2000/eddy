import { Component, computed, effect, inject } from '@angular/core';
import { UserStore } from '../../store/user/user.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { MomentPipe } from '../../utils/pipes/moment.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, InlineSVGModule, TranslateModule, NgOptimizedImage, MomentPipe],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-72">
        <div class="flex flex-row items-center justify-center w-full">
          <div
            class="my-6 inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-zinc-500"
          >
            <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[34rem]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 relative -left-1"></span>
          <span class="text-md font-semibold text-zinc-500 mt-2">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-96">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'warning-triangle.svg'" class="text-red-500"></span>
          <span class="text-sm text-red-500 mt-2">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    @switch (profile.status()) { @case('loaded') {
    <article class="h-[calc(100vh_+_36px)] relative -top-10">
      <div>
        <div>
          <img
            class="h-32 w-full object-cover lg:h-48"
            ngSrc="/assets/images/profile-banner.jpg"
            width="768"
            height="432"
            priority
          />
        </div>
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div class="flex">
              <img
                class="h-24 w-24 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-900 sm:h-32 sm:w-32"
                [src]="user().picture"
                alt=""
              />
            </div>
            <div class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div class="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                <h1 class="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {{ user().name }} {{ user().surname }}
                </h1>
              </div>
              <div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  type="button"
                  class="flex fle-row items-center rounded-lg p-2 cursor-pointer text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1 ring-inset ring-zinc-500/30 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/50 transition ease-in-out duration-200"
                  (click)="auth.logout()"
                >
                  <span inlineSVG="log-out.svg" class="text-zinc-700 dark:text-zinc-200 stroke-[1.6]"></span>
                  <span class="text-zinc-700 dark:text-zinc-200 mx-1">{{ 'LOGOUT' | translate }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
            <h1 class="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {{ user().name }} {{ user().surname }}
            </h1>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-8 sm:mt-10 lg:mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-zinc-500">Nickname</dt>
            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">
              {{ user().nickname }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-zinc-500">Email</dt>
            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
              {{ user().email }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-zinc-500">
              {{ 'ROLE' | translate }}
            </dt>
            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">
              {{ user().role }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-zinc-500">
              {{ 'UPDATEDAT' | translate }}
            </dt>
            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">
              {{ user().updated_at | moment : translate.currentLang }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="mx-auto mt-10 max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 class="text-sm font-medium text-zinc-500 mb-4">
          {{ 'DEPARTMENTS' | translate }}
        </h2>
        <div class="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
          @for (department of user().departments; track $index) {
          <div
            class="flex fle-row items-center rounded-lg px-6 py-5 cursor-pointer text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1 ring-inset ring-zinc-500/30 transition ease-in-out duration-200"
          >
            <div class="flex-shrink-0">
              <span inlineSVG="box.svg" class="svg-icon-3 stroke-[1.6] text-zinc-400 dark:text-zinc-600"></span>
            </div>
            <div class="min-w-0 flex-1 ml-3">
              <div class="focus:outline-none">
                <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {{ department.name }}
                </p>
                <p class="truncate text-sm text-zinc-500">
                  {{ 'USERS' | translate }}:
                  {{ department.users.length }}
                </p>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </article>
    } @case('loading') {
    <ng-container *ngTemplateOutlet="loading"></ng-container>
    } @case('error') {
    <ng-container *ngTemplateOutlet="error"></ng-container>
    } @default {
    <ng-container *ngTemplateOutlet="empty"></ng-container>
    } }
  `,
})
export class ProfileComponent {
  profile = inject(UserStore);
  auth = inject(AuthService);
  user = computed(() => this.profile.me());
  translate = inject(TranslateService);

  logout() {
    this.auth.logout({ returnTo: window.location.origin } as LogoutOptions);
  }
}
