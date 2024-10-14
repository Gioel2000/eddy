import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';
import { WorldComponent } from '../../../../ui/world/world.component';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { StepperComponent } from '../../stepper/stepper.component';
import { StructureStore } from '../../../../store/structures/structure.service';
import { SettingsService } from '../../../../ui/settings/settings.service';
import { UserPanelService } from '../../../../ui/user/user.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import moment from 'moment';
import { Router } from '@angular/router';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';
import { SetupStore } from '../../../../store/setup/setup.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { AddCompetitorSetupDialogService } from './add-competitor-dialog/add-competitor-dialog.service';
import { CompetitorsStore } from '../../../../store/competitors/competitors.service';

@UntilDestroy()
@Component({
  selector: 'step3',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LoaderComponent,
    InlineSVGModule,
    ReactiveFormsModule,
    WorldComponent,
    ClickOutsideDirective,
    StepperComponent,
    MissingTranslationPipe,
    GoogleMapsModule,
  ],
  template: `
    <ng-template #loading>
      <div class="col-span-1 px-6 pb-24 pt-8 sm:pt-24 sm:pb-32 lg:px-8 lg:min-h-screen">
        <div class="flex flex-col items-center">
          <world
            [title]="'SEARCHING_COMPETITORS' | translate"
            [description]="'COMPETITORS_DESCRIPTION' | translate"
          ></world>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-56">
        <div class="flex flex-col items-center justify-center w-full">
          <span class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
              <title>triangle warning</title>
              <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                <path
                  d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <line
                  x1="9"
                  y1="6.5"
                  x2="9"
                  y2="10"
                  fill="none"
                  stroke="inherit"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  data-color="color-2"
                ></line>
                <path
                  d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                  data-color="color-2"
                  data-stroke="none"
                  stroke="none"
                ></path>
              </g>
            </svg>
          </span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div class="relative isolate bg-white dark:bg-dark">
      <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 w-full">
        <stepper></stepper>
        @switch (store.stateCompetitors()) { @case ('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case ('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @case ('empty') {
        <div class="col-span-1 px-6 pb-24 pt-20 sm:pt-24 sm:pb-32 lg:px-8 lg:min-h-screen">
          <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div class="max-w-7xl mx-auto">
              <div>
                <div class="flex flex-row items-center justify-center px-6 h-[50rem] sm:px-6 sm:py-32 lg:px-8">
                  <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                      {{ 'NO_COMPETITORS_FOUND' | translate }}
                    </h2>
                    <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                      {{ 'NO_COMPETITORS_FOUND_DESCRIPTION' | translate }}
                    </p>
                    <div class="mt-10 flex items-center justify-center gap-x-6">
                      <button
                        class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px"
                        (click)="save()"
                      >
                        <div
                          class="flex flex-row items-center justify-center gap-x-2 svg-icon-7 stroke-2 bg-accent dark:bg-accentDark h-full px-3.5 py-2.5 rounded-[7px] cursor-pointer"
                        >
                          <span class="font-semibold text-base"> {{ 'CONFIRM' | translate }}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                            <title>check</title>
                            <g fill="currentColor" class="nc-icon-wrapper">
                              <polyline
                                points="2.75 9.25 6.75 14.25 15.25 3.75"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></polyline>
                            </g>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        } @case ('loaded') {
        <div class="col-span-1 px-6 pb-24 pt-20 sm:pt-24 sm:pb-32 lg:px-8 lg:min-h-screen">
          <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div class="hidden xl:flex flex-row items-center justify-between relative -bottom-96 -mx-10 h-0">
              <button
                class="svg-icon-5 stroke-[1.8] pr-4 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-500 cursor-pointer disabled:opacity-30 w-0"
                [disabled]="index() === 0"
                (click)="prev()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>chevron left</title>
                  <g fill="currentColor" class="nc-icon-wrapper">
                    <polyline
                      points="11.5 15.25 5.25 9 11.5 2.75"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></polyline>
                  </g>
                </svg>
              </button>

              <button
                class="svg-icon-5 stroke-[1.8] pr-4 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-500 cursor-pointer disabled:opacity-30 w-0"
                [disabled]="index() === store.competitors().length"
                (click)="next()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>chevron right</title>
                  <g fill="currentColor" class="nc-icon-wrapper">
                    <polyline
                      points="6.5 2.75 12.75 9 6.5 15.25"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></polyline>
                  </g>
                </svg>
              </button>
            </div>

            <div class="max-w-7xl mx-auto">
              @if (suggestNextStep()) {
              <div>
                <div class="flex flex-row items-center justify-center px-6 h-[50rem] sm:px-6 sm:py-32 lg:px-8">
                  <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                      {{ 'NO_MORE_COMPETITORS' | translate }}
                    </h2>
                    <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                      {{ 'NO_MORE_COMPETITORS_DESCRIPTION' | translate }}
                    </p>
                    <div class="mt-10 flex items-center justify-center gap-x-6">
                      <button
                        class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px"
                        (click)="save()"
                      >
                        <div
                          class="flex flex-row items-center justify-center gap-x-2 svg-icon-7 stroke-2 bg-accent dark:bg-accentDark h-full px-3.5 py-2.5 rounded-[7px] cursor-pointer"
                        >
                          <span class="font-semibold text-base"> {{ 'CONFIRM' | translate }}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                            <title>check</title>
                            <g fill="currentColor" class="nc-icon-wrapper">
                              <polyline
                                points="2.75 9.25 6.75 14.25 15.25 3.75"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></polyline>
                            </g>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              } @else {
              <div class="ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-xl p-8">
                <div class="flex flex-row justify-between mb-3">
                  <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 w-full truncate">
                    {{ competitor().name }}
                  </h2>
                  <a
                    class="flex flex-col items-center justify-center rounded-md p-1.5 ml-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ease-in-out duration-200 animate-blurToClear200  transform"
                    (click)="openLink(competitor().url)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18"
                      width="18"
                      viewBox="0 0 18 18"
                      class="text-zinc-400 dark:text-zinc-500 stroke-[1.7]"
                    >
                      <title>share up right</title>
                      <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                        <polyline
                          points="10.5 2.75 15.25 2.75 15.25 7.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke="currentColor"
                        ></polyline>
                        <line
                          x1="15.25"
                          y1="2.75"
                          x2="9"
                          y2="9"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke="currentColor"
                        ></line>
                        <path
                          d="M15.25,10.5v2.75c0,1.105-.895,2-2,2H4.75c-1.105,0-2-.895-2-2V4.75c0-1.105,.895-2,2-2h2.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </a>
                </div>

                <p
                  class="flex flex-row items-center gap-x-1 col-span-1 svg-icon-7 stroke-[1.6] text-sm font-medium leading-6 text-zinc-400 dark:text-zinc-600 mb-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>pin</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <path
                        d="M14.779,7.266c0,2.622-3.428,6.833-5.004,8.631-.413,.471-1.139,.471-1.551,0-1.576-1.797-5.004-6.008-5.004-8.631C3.221,3.776,6.207,1.75,9,1.75s5.779,2.026,5.779,5.516Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <circle
                        cx="9"
                        cy="7.5"
                        r="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="currentColor"
                      ></circle>
                    </g>
                  </svg>
                  {{ competitor().address }}, {{ competitor().city }}
                </p>

                <p
                  class="flex flex-row items-center gap-x-1 col-span-1 svg-icon-7 stroke-[1.6] text-sm font-medium leading-6 text-zinc-400 dark:text-zinc-600 mb-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>phone</title>
                    <g fill="currentColor" class="nc-icon-wrapper">
                      <path
                        d="M11.347,10.646l-1.141,1.426c-1.767-1.039-3.24-2.511-4.278-4.278l1.426-1.141c.344-.275,.459-.748,.28-1.15l-1.3-2.927c-.193-.434-.671-.664-1.13-.545l-2.475,.642c-.478,.125-.787,.588-.719,1.077,.892,6.354,5.886,11.348,12.241,12.241,.489,.067,.952-.242,1.076-.719l.642-2.475c.119-.459-.111-.936-.544-1.129l-2.927-1.3c-.402-.179-.874-.064-1.15,.279Z"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                  {{ competitor().phone }}
                </p>

                <div class="relative isolate bg-white dark:bg-dark mt-6">
                  <div
                    class="hidden sm:grid grid-rows-1 gap-4 text-sm leading-6 text-zinc-900 grid-cols-2 mx-0 max-w-none grid-flow-col"
                  >
                    <figure
                      class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5 col-span-2 col-start-2 row-end-1"
                    >
                      <img [src]="getUrl(competitor().photos[0])" alt="" class="w-full h-64 object-cover rounded-md" />
                    </figure>
                    <div class="contents space-y-0">
                      <div class="space-y-4 row-span-2">
                        <figure class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5">
                          <img
                            [src]="getUrl(competitor().photos[1])"
                            alt=""
                            class="w-full h-[120px] object-cover rounded-md"
                          />
                        </figure>
                        <figure class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5">
                          <img
                            [src]="getUrl(competitor().photos[2])"
                            alt=""
                            class="w-full h-[120px] object-cover rounded-md"
                          />
                        </figure>
                        <figure class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5">
                          <img
                            [src]="getUrl(competitor().photos[3])"
                            alt=""
                            class="w-full h-[120px] object-cover rounded-md"
                          />
                        </figure>
                      </div>
                    </div>
                    <div class="contents space-y-0">
                      <figure class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5">
                        <img
                          [src]="getUrl(competitor().photos[4])"
                          alt=""
                          class="w-full h-[120px] object-cover rounded-md"
                        />
                      </figure>
                      <figure class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5">
                        <img
                          [src]="getUrl(competitor().photos[5])"
                          alt=""
                          class="w-full h-[120px] object-cover rounded-md"
                        />
                      </figure>
                    </div>
                  </div>
                  <div class="block sm:hidden text-zinc-900 mx-0">
                    <figure
                      class="rounded-xl bg-white dark:bg-dark shadow-sm ring-1 ring-zinc-900/5 col-span-2 col-start-2 row-end-1"
                    >
                      <img [src]="getUrl(competitor().photos[0])" alt="" class="w-full h-64 object-cover rounded-md" />
                    </figure>
                  </div>
                </div>

                <div class="w-full z-0 rounded-md mt-4">
                  <google-map
                    width="100%"
                    height="120px"
                    [zoom]="16"
                    [options]="{ disableDefaultUI: true }"
                    [center]="{ lat: markers()[0].position.lat, lng: markers()[0].position.lng }"
                  >
                    <map-marker *ngFor="let marker of markers()" [position]="marker.position"> </map-marker>
                  </google-map>
                </div>

                <div class="flex flex-row items-center justify-between w-full mt-10">
                  @if (competitor().isAdded) {
                  <h1
                    class="flex flex-row items-center justify-center gap-1 text-green-500 w-full stroke-2 text-lg font-medium leading-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                      <g fill="currentColor" class="nc-icon-wrapper">
                        <polyline
                          points="2.75 9.25 6.75 14.25 15.25 3.75"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></polyline>
                      </g>
                    </svg>
                    {{ 'ADDED' | translate }}
                  </h1>
                  } @else { @if (competitor().competitorReferenceId) {
                  <button
                    class="w-full col-start-1 col-span-full sm:col-start-2 sm:col-span-1 cursor-pointer xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-md shadow-black/20 hover:shadow-lg hover:shadow-accent/40 hover:dark:shadow-accentDark/40 disabled:opacity-30"
                    [disabled]="!canAdd()"
                    (click)="channels()"
                  >
                    <div
                      class="flex flex-row items-center justify-center gap-x-2 svg-icon-9 stroke-[2.6px] bg-accent dark:bg-accentDark h-full px-3.5 py-2.5 rounded-[7px] cursor-pointer"
                    >
                      <span class="font-semibold text-base">{{ 'CONFIGURE_CHANNELS' | translate }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                        <title>sliders vertical</title>
                        <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                          <line
                            x1="12.75"
                            y1="13.25"
                            x2="12.75"
                            y2="16.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="currentColor"
                          ></line>
                          <line
                            x1="12.75"
                            y1="1.75"
                            x2="12.75"
                            y2="8.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="currentColor"
                          ></line>
                          <circle
                            cx="12.75"
                            cy="11"
                            r="2.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="currentColor"
                          ></circle>
                          <line
                            x1="5.25"
                            y1="4.75"
                            x2="5.25"
                            y2="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></line>
                          <line
                            x1="5.25"
                            y1="16.25"
                            x2="5.25"
                            y2="9.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></line>
                          <circle cx="5.25" cy="7" r="2.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                        </g>
                      </svg>
                    </div>
                  </button>
                  } @else {
                  <button
                    class="w-full col-start-1 col-span-full sm:col-start-2 sm:col-span-1 cursor-pointer xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-md shadow-black/20 hover:shadow-lg hover:shadow-accent/40 hover:dark:shadow-accentDark/40 disabled:opacity-30"
                    [disabled]="!canAdd()"
                    (click)="add()"
                  >
                    <div
                      class="flex flex-row items-center justify-center gap-x-2 svg-icon-9 stroke-[2.6px] bg-accent dark:bg-accentDark h-full px-3.5 py-2.5 rounded-[7px] cursor-pointer"
                    >
                      <span class="font-semibold text-base"> {{ 'ADD' | translate }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                        <title>plus</title>
                        <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                          <line
                            x1="9"
                            y1="3.25"
                            x2="9"
                            y2="14.75"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            data-color="color-2"
                          ></line>
                          <line
                            x1="3.25"
                            y1="9"
                            x2="14.75"
                            y2="9"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></line>
                        </g>
                      </svg>
                    </div>
                  </button>
                  } }
                </div>
              </div>
              }
              <div class="xl:hidden flex flex-row items-center justify-between pt-7 pb-5">
                <button
                  type="button"
                  class="flex flex-row items-center gap-x-2 rounded-[8px] bg-transparent px-4 h-11 text-sm svg-icon-7 stroke-2 font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30"
                  [disabled]="index() === 0"
                  (click)="prev()"
                >
                  {{ 'PREVIOUS' | translate }}
                </button>
                <button
                  type="button"
                  class="flex flex-row items-center gap-x-2 rounded-[8px] bg-transparent px-4 h-11 text-sm svg-icon-7 stroke-2 font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30"
                  [disabled]="index() === store.competitors().length"
                  (click)="next()"
                >
                  {{ 'NEXT' | translate }}
                </button>
              </div>
              <p class="text-zinc-400 dark:text-zinc-600 text-sm font-normal tracking-tight italic mt-6">
                {{ 'COMPETITOR_MAX_LIMIT' | translate }}
              </p>
            </div>
          </div>
        </div>
        } }
      </div>

      <footer class="bg-zinc-100 dark:bg-dark border-t border-zinc-300 dark:border-zinc-800">
        <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <div class="flex justify-center space-x-6 mt-5 sm:pt-0">
            <a
              href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
              class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
              title="Cookie Policy"
              ><span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>cookie</title>
                  <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                    <path
                      d="M14.75,8c-1.91,0-3.469-1.433-3.703-3.28-.099,.01-.195,.03-.297,.03-1.618,0-2.928-1.283-2.989-2.887-3.413,.589-6.011,3.556-6.011,7.137,0,4.004,3.246,7.25,7.25,7.25s7.25-3.246,7.25-7.25c0-.434-.045-.857-.118-1.271-.428,.17-.893,.271-1.382,.271Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <circle cx="12.25" cy="1.75" r=".75" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle cx="14.75" cy="4.25" r=".75" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle
                      cx="11.25"
                      cy="11.75"
                      r=".75"
                      data-color="color-2"
                      data-stroke="none"
                      stroke="none"
                    ></circle>
                    <circle cx="7" cy="7" r="1" data-color="color-2" data-stroke="none" stroke="none"></circle>
                    <circle
                      cx="7.25"
                      cy="11.25"
                      r="1.25"
                      data-color="color-2"
                      data-stroke="none"
                      stroke="none"
                    ></circle>
                  </g>
                </svg> </span
              >Cookie Policy</a
            >
            <script type="text/javascript">
              (function (w, d) {
                var loader = function () {
                  var s = d.createElement('script'),
                    tag = d.getElementsByTagName('script')[0];
                  s.src = 'https://cdn.iubenda.com/iubenda.js';
                  tag.parentNode.insertBefore(s, tag);
                };
                if (w.addEventListener) {
                  w.addEventListener('load', loader, false);
                } else if (w.attachEvent) {
                  w.attachEvent('onload', loader);
                } else {
                  w.onload = loader;
                }
              })(window, document);
            </script>
            <a
              href="https://www.iubenda.com/privacy-policy/40734880"
              class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
              title="Privacy Policy"
              ><span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>lock</title>
                  <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                    <path
                      d="M5.75,8.25v-3.25c0-1.795,1.455-3.25,3.25-3.25h0c1.795,0,3.25,1.455,3.25,3.25v3.25"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></path>
                    <line
                      x1="9"
                      y1="11.75"
                      x2="9"
                      y2="12.75"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      data-color="color-2"
                    ></line>
                    <rect
                      x="3.25"
                      y="8.25"
                      width="11.5"
                      height="8"
                      rx="2"
                      ry="2"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></rect>
                  </g>
                </svg> </span
              >Privacy Policy</a
            >
            <script type="text/javascript">
              (function (w, d) {
                var loader = function () {
                  var s = d.createElement('script'),
                    tag = d.getElementsByTagName('script')[0];
                  s.src = 'https://cdn.iubenda.com/iubenda.js';
                  tag.parentNode.insertBefore(s, tag);
                };
                if (w.addEventListener) {
                  w.addEventListener('load', loader, false);
                } else if (w.attachEvent) {
                  w.attachEvent('onload', loader);
                } else {
                  w.onload = loader;
                }
              })(window, document);
            </script>
            <a
              class="flex flex-row gap-x-1 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm shadow-black/10 dark:shadow-black rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 ring-zinc-900/10 dark:ring-zinc-50/20"
              href="mailto:support@eddy.restaurant"
            >
              <span class="svg-icon svg-icon-6 stroke-[1.6]">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                  <title>circle question</title>
                  <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                    <circle cx="9" cy="9" r="7.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                    <path
                      d="M6.925,6.619c.388-1.057,1.294-1.492,2.18-1.492,.895,0,1.818,.638,1.818,1.808,0,1.784-1.816,1.468-2.096,3.065"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M8.791,13.567c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                      stroke="none"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </span>
              <span>{{ 'HELP' | translate }}</span>
            </a>
          </div>
          <nav class="-mb-6 mt-10 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div class="pb-6 text-center">
              <a
                class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
                (click)="userPanelUI.togglePanel()"
                >{{ 'MY_PROFILE' | translate }}</a
              >
            </div>
            <div class="pb-6 text-center">
              <a
                class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
                (click)="settingsUI.openDialog()"
                >{{ 'SETTINGS' | translate }}</a
              >
            </div>
          </nav>

          <p class="mt-10 text-center text-xs leading-5 text-zinc-500">
            &copy; {{ currentYear }} Diamond Tech, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class Step3Component {
  store = inject(SetupStore);
  router = inject(Router);
  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  dialog = inject(AddCompetitorSetupDialogService);
  structure = inject(StructureStore);
  competitorStore = inject(CompetitorsStore);

  readonly currentYear = moment(new Date()).year();

  index = signal(0);
  markers = computed(() => {
    const competitor = this.store.competitors()[this.index()];
    return [
      {
        position: {
          lat: competitor?.geometry?.location.lat,
          lng: competitor?.geometry?.location.lng,
        },
      },
    ];
  });

  competitor = computed(() => {
    const competitor = this.store.competitors()[this.index()];
    const address: string =
      competitor?.address_components?.find((c) => c.types.includes('route') || c.types.includes('sublocality_level_2'))
        ?.long_name || '';
    const number: string =
      competitor?.address_components?.find((c) => c.types.includes('street_number'))?.long_name || '';
    const zipCode: string =
      competitor?.address_components?.find((c) => c.types.includes('postal_code'))?.long_name || '';
    const city: string =
      competitor?.address_components?.find(
        (c) =>
          c.types.includes('locality') ||
          c.types.includes('administrative_area_level_3') ||
          c.types.includes('postal_town')
      )?.long_name || '';

    const googlePlaceId = competitor.place_id || '';
    const isAdded = competitor.isAdded;

    return {
      competitorReferenceId: competitor?.competitorReference?.id || '',
      name: competitor?.name || '',
      address: `${address} ${number}`,
      city: city,
      zipCode: zipCode,
      phone: competitor?.phone || '',
      url: competitor?.website || '',
      placeId: googlePlaceId,
      photos: competitor?.photos || ([] as any[]),
      isAdded,
    };
  });

  canAdd = computed(() => {
    const competitors = this.store.competitors().filter((c) => c.isAdded);
    return competitors.length < 3;
  });

  suggestNextStep = signal(false);

  constructor() {
    this.store.retrive();
  }

  getUrl(googlephoto: { height: number; html_attributions: string[]; photo_reference: string; width: number }) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${googlephoto.width}&photoreference=${googlephoto.photo_reference}&key=AIzaSyAHZLeQ42t5INTGE4OKGUNmWpvjHqFGR6M`;
  }

  openLink(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  add() {
    this.store.selectByPlace(this.competitor().placeId);
    this.store.step.set(1);
    this.dialog.openDialog();
  }

  channels() {
    this.store.selectByPlace(this.competitor().placeId);
    this.store.step.set(2);
    this.dialog.openDialog();
  }

  next() {
    if (this.index() === this.store.competitors().length - 1) {
      this.suggestNextStep.set(true);
      return;
    }
    this.index.set(this.index() + 1);
  }

  prev() {
    if (this.index() === 0) return;
    this.index.set(this.index() - 1);

    if (this.suggestNextStep()) {
      this.suggestNextStep.set(false);
    }
  }

  save() {
    this.structure.setCompetitorsCompleted();
    // this.competitorStore.reload();
  }
}
