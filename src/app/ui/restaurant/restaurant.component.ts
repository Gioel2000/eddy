import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RestaurantPanelService } from './panel.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { LoaderComponent } from '../loader/loader.component';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import { StructureStore } from '../../store/structures/structure.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { OverviewRestaurantPanelComponent } from './overview/overview.component';
import { EditRestaurantPanelComponent } from './edit/edit.component';
import { ChannelsRestaurantPanelComponent } from './channels/channels.component';
import { UsersRestaurantPanelComponent } from './users/users.component';
import { UserStore } from '../../store/user/user.service';
import { DialogService } from './dialog.service';
import { UserDialogComponent } from './user/user.component';
import { DeleteRestaurantPanelComponent } from './delete/delete.component';
import { filter } from 'rxjs';

export interface MarkerInterface {
  structure: any;
  position: google.maps.LatLngLiteral | google.maps.LatLng;
}

@UntilDestroy()
@Component({
  selector: 'restaurant-panel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ClickOutsideDirective,
    LoaderComponent,
    MomentPipe,
    GoogleMapsModule,
    ReactiveFormsModule,
    OverviewRestaurantPanelComponent,
    EditRestaurantPanelComponent,
    ChannelsRestaurantPanelComponent,
    UsersRestaurantPanelComponent,
    UserDialogComponent,
    DeleteRestaurantPanelComponent,
  ],
  template: `
    <user-dialog></user-dialog>
    <div
      class="relative z-40"
      [ngClass]="{
        hidden: (!dialog.isDialogOpen() && !panelUI.isPanelOpen()),
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
              'translate-x-0': !dialog.isDialogOpen() && panelUI.isPanelVisible(),
              'translate-x-full': !dialog.isDialogOpen() && !panelUI.isPanelVisible()
            }"
            (clickOutside)="!dialog.isDialogOpen() && panelUI.isPanelVisible() && panelUI.closePanel()"
          >
            <div class="pointer-events-auto w-screen max-w-xl">
              <div
                class="flex h-full flex-col divide-y divide-zinc-200 dark:divide-zinc-800 border-l border-zinc-300 dark:border-zinc-700 shadow-md"
              >
                <div class="h-0 flex-1 overflow-y-auto">
                  <div class="flex fle-row items-center justify-end w-full h-0 z-50 relative -bottom-7 -left-4">
                    <button
                      type="button"
                      class="relative z-50 rounded-md p-1.5 bg-black/40 hover:bg-black/50 hover:dark:bg-zinc-50/5 text-zinc-200 focus:outline-none transition ease-in-out duration-100"
                      (click)="panelUI.closePanel()"
                    >
                      <span class="svg-icon svg-icon-5" inlineSVG="xmark.svg"></span>
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
                          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-3 text-zinc-500 stroke-[1.4]"></span>
                          <span class="text-base font-medium text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    <ng-template #error>
                      <div
                        id="error-view"
                        class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-96"
                      >
                        <div class="flex flex-col items-center justify-center w-full">
                          <span
                            [inlineSVG]="'triangle-warning.svg'"
                            class="svg-icon svg-icon-3 text-red-500 stroke-[1.4]"
                          ></span>
                          <span class="text-base font-medium text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    <div class="bg-white dark:bg-zinc-800 h-screen relative -top-8">
                      <div>
                        @if (structures.selected(); as selectedStructure) {
                        <div>
                          <img class="h-44 w-full object-cover lg:h-64" [src]="selectedStructure.image" />
                        </div>
                        <div class="flex flex-row items-center justify-between gap-x-2 px-4 py-6 sm:px-6 xl:px-8">
                          <div class="flex flex-col items-start gap-y-2">
                            <h2 class="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                              {{ selectedStructure.name }}
                            </h2>
                          </div>
                          <button
                            id="change-restaurant"
                            type="button"
                            class="flex fle-row items-center rounded-lg px-2.5 py-2 cursor-pointer text-sm shadow-sm text-zinc-900 dark:text-zinc-100 shadow-black/10 font-semibold ring-1 ring-zinc-500/30 hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                            (click)="structures.exit(); panelUI.closePanel()"
                          >
                            {{ 'CHANGE_RESTAURANT' | translate }}
                          </button>
                        </div>

                        <div>
                          <div class="sm:hidden px-4">
                            <label for="tabs" class="sr-only">Select a tab</label>
                            <select
                              id="tabs"
                              name="tabs"
                              class="block w-full mb-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md border-zinc-300 dark:border-zinc-700 py-2 pl-3 pr-10 focus:border-accent focus:outline-none focus:ring-accent text-sm"
                              [formControl]="pageOption"
                            >
                              <option value="overview">{{ 'OVERVIEW' | translate }}</option>
                              <option value="edit">{{ 'INFORMATIONS' | translate }}</option>
                              <option value="channels">{{ 'CHANNELS' | translate }}</option>
                              <option value="users">{{ 'USERS' | translate }}</option>
                              <option value="delete">{{ 'DELETE' | translate }}</option>
                            </select>
                          </div>
                          <div class="hidden sm:block">
                            <div
                              class="border-b border-zinc-200 dark:border-zinc-700 overflow-x-auto overflow-y-hidden"
                            >
                              <nav class="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
                                <a
                                  id="overview-restaurant-tab"
                                  class="border-transparent hover:border-zinc-300 hover:text-zinc-700 whitespace-nowrap border-b-2 py-4 text-sm font-medium"
                                  aria-current="page"
                                  [ngClass]="{
                                    'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100':
                                      page() === 'overview',
                                    'hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 text-zinc-500':
                                      page() !== 'overview'
                                  }"
                                  (click)="page.set('overview')"
                                  >{{ 'OVERVIEW' | translate }}</a
                                >
                                <a
                                  id="info-restaurant-tab"
                                  class="border-transparent text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 whitespace-nowrap border-b-2 py-4 text-sm font-medium"
                                  [ngClass]="{
                                    'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100':
                                      page() === 'edit',
                                    'hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 text-zinc-500':
                                      page() !== 'edit'
                                  }"
                                  (click)="page.set('edit')"
                                  >{{ 'INFORMATIONS' | translate }}</a
                                >
                                <a
                                  id="channels-restaurant-tab"
                                  class="border-transparent text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 whitespace-nowrap border-b-2 py-4 text-sm font-medium"
                                  [ngClass]="{
                                    'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100':
                                      page() === 'channels',
                                    'hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 text-zinc-500':
                                      page() !== 'channels'
                                  }"
                                  (click)="page.set('channels')"
                                  >{{ 'CHANNELS' | translate }}</a
                                >
                                @if (user.me().role === 'admin' || user.me().role === 'superadmin') {
                                <a
                                  id="users-restaurant-tab"
                                  class="border-transparent text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 whitespace-nowrap border-b-2 py-4 text-sm font-medium"
                                  [ngClass]="{
                                    'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100':
                                      page() === 'users',
                                    'hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 text-zinc-500':
                                      page() !== 'users'
                                  }"
                                  (click)="page.set('users')"
                                  >{{ 'USERS' | translate }}</a
                                >
                                }
                                <a
                                  id="delete-restaurant-tab"
                                  class="border-transparent text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 whitespace-nowrap border-b-2 py-4 text-sm font-medium"
                                  [ngClass]="{
                                    'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100':
                                      page() === 'delete',
                                    'hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 text-zinc-500':
                                      page() !== 'delete'
                                  }"
                                  (click)="page.set('delete')"
                                  >{{ 'DELETE' | translate }}</a
                                >
                              </nav>
                            </div>
                          </div>
                        </div>
                        } @switch (page()) { @case('overview') { @defer (on viewport; prefetch on idle) {
                        <restaurant-panel-overview></restaurant-panel-overview>
                        } @placeholder {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } @loading {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } } @case ('edit') { @defer (on viewport; prefetch on idle) {<restaurant-panel-edit
                        ></restaurant-panel-edit> } @placeholder {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } @loading {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } } @case ('channels') { @defer (on viewport; prefetch on idle) {<restaurant-panel-channels
                        ></restaurant-panel-channels> } @placeholder {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } @loading {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } } @case ('users') { @defer (on viewport; prefetch on idle) {
                        <restaurant-panel-users></restaurant-panel-users>
                        } @placeholder {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } @loading {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } } @case ('delete') { @defer (on viewport; prefetch on idle) {
                        <restaurant-panel-delete></restaurant-panel-delete>
                        } @placeholder {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } @loading {
                        <div><ng-container *ngTemplateOutlet="loading"></ng-container></div>
                        } } }
                      </div>
                    </div>
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
export class RestaurantPanelComponent {
  panelUI = inject(RestaurantPanelService);
  structures = inject(StructureStore);
  user = inject(UserStore);
  dialog = inject(DialogService);

  page = signal('overview');
  pageOption = new FormControl('overview');

  constructor() {
    this.pageOption.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((page): page is string => !!page)
      )
      .subscribe((value) => this.page.set(value));
  }
}
