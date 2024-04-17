import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserPanelService } from './user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { LoaderComponent } from '../loader/loader.component';
import { UserStore } from '../../store/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import { environment } from '../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'user-panel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    LoaderComponent,
    MomentPipe,
  ],
  template: `
    <div
      class="relative z-40"
      [ngClass]="{
        hidden: !panelUI.isPanelOpen(),
      }"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0"></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="transform transition ease-in-out duration-300 sm:duration-700 pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
            [ngClass]="{
              'translate-x-0': panelUI.isPanelVisible(),
              'translate-x-full': !panelUI.isPanelVisible()
            }"
            (clickOutside)="panelUI.isPanelVisible() && panelUI.closePanel()"
          >
            <div class="pointer-events-auto w-screen max-w-xl">
              <div
                class="flex h-full flex-col divide-y divide-zinc-200 dark:divide-zinc-800 border-l border-zinc-300 dark:border-zinc-700 shadow-md"
              >
                <div class="h-0 flex-1 overflow-y-auto">
                  <div class="flex fle-row items-center justify-end w-full h-0 z-50 relative -bottom-7 -left-4">
                    <button
                      type="button"
                      class="relative z-50 rounded-md p-1.5 bg-white/20 hover:bg-white/10 hover:dark:bg-zinc-50/5 text-zinc-200 focus:outline-none transition ease-in-out duration-100"
                      (click)="panelUI.closePanel()"
                    >
                      <span class="svg-icon-5" inlineSVG="xmark.svg"></span>
                    </button>
                  </div>
                  <nav class="h-full overflow-y-auto bg-white dark:bg-zinc-800" aria-label="Directory">
                    <ng-template #loading>
                      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-72">
                        <div class="flex flex-row items-center justify-center w-full">
                          <loader></loader>
                        </div>
                      </div>
                    </ng-template>

                    <ng-template #empty>
                      <div
                        class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[34rem]"
                      >
                        <div class="flex flex-col items-center justify-center w-full">
                          <span [inlineSVG]="'ufo.svg'" class="svg-icon-3 text-zinc-500 stroke-[1.4]"></span>
                          <span class="text-base font-medium text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    <ng-template #error>
                      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-96">
                        <div class="flex flex-col items-center justify-center w-full">
                          <span
                            [inlineSVG]="'triangle-warning.svg'"
                            class="svg-icon-3 text-red-500 stroke-[1.4]"
                          ></span>
                          <span class="text-base font-medium text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    @switch (profile.status()) { @case('loaded') {
                    <article class="bg-white dark:bg-zinc-800 h-screen relative -top-8">
                      <div>
                        <div>
                          <img class="h-32 w-full object-cover lg:h-48" src="/assets/images/profile-banner.jpg" />
                        </div>
                        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                          <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div class="flex">
                              <img
                                class="h-24 w-24 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-800 sm:h-32 sm:w-32"
                                [src]="user().picture"
                                alt=""
                              />
                            </div>
                            <div
                              class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
                            >
                              <div class="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                                <h1 class="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                  {{ user().name }} {{ user().surname }}
                                </h1>
                              </div>
                              <div
                                class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
                              >
                                <button
                                  type="button"
                                  class="flex fle-row items-center rounded-lg px-2.5 py-2 cursor-pointer text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1  ring-zinc-500/30 hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                                  (click)="logout()"
                                >
                                  <span
                                    inlineSVG="rect-logout.svg"
                                    class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"
                                  ></span>
                                  <span class="text-zinc-700 dark:text-zinc-200 ml-1.5 mr-1">{{
                                    'EXIT' | translate
                                  }}</span>
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

                      <div class="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
                        <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-zinc-500">Nickname</dt>
                            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">
                              {{ user().nickname }}
                            </dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-zinc-500">Email</dt>
                            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{{ user().email }}</dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-zinc-500">{{ 'ROLE' | translate }}</dt>
                            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">{{ user().role }}</dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-zinc-500">{{ 'UPDATEDAT' | translate }}</dt>
                            <dd class="mt-1 text-sm text-zinc-900 dark:text-zinc-100 capitalize">
                              {{ user().updated_at | moment : translate.currentLang }}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                    } @case('loading') {
                    <ng-container *ngTemplateOutlet="loading"></ng-container>
                    } @case('error') {
                    <ng-container *ngTemplateOutlet="error"></ng-container>
                    } @default {
                    <ng-container *ngTemplateOutlet="empty"></ng-container>
                    } }
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserPanelComponent {
  panelUI = inject(UserPanelService);

  profile = inject(UserStore);
  auth = inject(AuthService);
  user = computed(() => this.profile.me());
  translate = inject(TranslateService);

  logout() {
    const { url } = environment;
    this.auth.logout().subscribe(() => window.open(url, '_self'));
  }
}
