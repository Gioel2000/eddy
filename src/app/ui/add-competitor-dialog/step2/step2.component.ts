import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddCompetitorDialogService } from '../add-competitor-dialog.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { WorldComponent } from '../../world/world.component';
import { MissingTranslationPipe } from '../../../utils/pipes/missingTranslation.pipe';
import { GoogleStep2Component } from '../../../pages/setup/steps/step2/ui/google.component';
import { TripadvisorStep2Component } from '../../../pages/setup/steps/step2/ui/tripadvisor.component';
import { TheForkStep2Component } from '../../../pages/setup/steps/step2/ui/thefork.component';
import { NoChannelComponent } from '../../../pages/setup/steps/step2/ui/no-channel.component';
import { EditChannelDialogService } from '../../../pages/setup/ui/edit-channel-dialog/edit-channel-dialog.service';
import { CompetitorsService } from '../../../pages/layout/competitors/competitors.service';
import { CompetitorsStore } from '../../../store/competitors/competitors.service';

@UntilDestroy()
@Component({
  selector: 'step2-competitor-dialog',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    WorldComponent,
    MissingTranslationPipe,
    GoogleStep2Component,
    TripadvisorStep2Component,
    TheForkStep2Component,
    NoChannelComponent,
  ],
  standalone: true,
  template: `
    <ng-template #loading>
      <div class="col-span-1 px-6 pb-24 pt-8 sm:pt-24 sm:pb-32 lg:px-8">
        <div class="flex flex-col items-center">
          <world
            [title]="'SEARCHING_CHANNELS' | translate"
            [description]="'CREATING_YOUR_RESTAURANT_DESCRIPTION' | translate"
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

    @switch (store.channelState()) { @case ('loading') {
    <ng-container *ngTemplateOutlet="loading"></ng-container>
    } @case ('error') {
    <ng-container *ngTemplateOutlet="error"></ng-container>
    } @case ('loaded') { @if (channels()[index()]; as selectedChannel) {
    <div class="col-span-1 pt-8">
      <div class="">
        <div class="max-w-7xl mx-auto">
          <div class="demo-sm:-mt-24 xl:mt-0">
            <div class="relative">
              <div class="rounded-xl min-w-full max-w-full demo-sm:min-w-0 demo-sm:max-w-none w-full">
                <div class="rounded-xl ring-1 ring-zinc-300 dark:ring-zinc-700">
                  <div
                    class="rounded-t-xl bg-gradient-to-b from-white to-[#FBFBFB] dark:bg-none dark:bg-zinc-700 dark:highlight-white/10"
                    style="box-shadow: inset 0 1px 0 0 #ffffff33;"
                  >
                    <div
                      class="py-2.5 grid items-center px-4 gap-6"
                      style="grid-template-columns:2.625rem 1fr 2.625rem"
                    >
                      <div class="flex items-center">
                        <div class="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]"></div>
                        <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]"></div>
                        <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]"></div>
                      </div>
                      <div>
                        <a
                          class="bg-zinc-100 hover:bg-zinc-50 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-zinc-900/5 mx-auto w-4/5 dark:bg-zinc-800 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-500 transition ease-in-out duration-200 animate-blurToClear200  transform"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="text-zinc-300 w-3.5 h-3.5 mr-1.5 dark:text-zinc-500"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <span class="max-w-32 sm:max-w-48 truncate">{{
                            selectedChannel.channel?.channel?.api?.url || ('NO_CHANNEL' | translate)
                          }}</span>
                        </a>
                      </div>
                      <div class="flex justify-end gap-x-3">
                        <a
                          class="flex flex-col items-center justify-center rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ease-in-out duration-200 animate-blurToClear200  transform"
                          (click)="openLink(selectedChannel.channel?.channel?.api?.url || '')"
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
                    </div>

                    <div
                      class="grid grid-cols-3 text-xs leading-5 overflow-hidden border-t border-zinc-200 dark:border-zinc-600"
                    >
                      <a
                        class="cursor-pointer svg-icon-9 font-medium px-4 py-1.5 flex items-center justify-center space-x-2 dark:text-zinc-200"
                        [ngClass]="{
                          'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100':
                            selectedChannel.key === 'google',
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600':
                            selectedChannel.key !== 'google'
                        }"
                        (click)="goTo('google')"
                      >
                        <svg
                          viewBox="0 0 25 25"
                          width="25"
                          height="25"
                          xmlns="http://www.w3.org/2000/svg"
                          class="flex-none"
                        >
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              [ngClass]="{
                                'fill-[#4285F4]': selectedChannel.key === 'google',
                                'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'google'
                              }"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              [ngClass]="{
                                'fill-[#34A853]': selectedChannel.key === 'google',
                                'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'google'
                              }"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              [ngClass]="{
                                'fill-[#FBBC05]': selectedChannel.key === 'google',
                                'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'google'
                              }"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              [ngClass]="{
                                'fill-[#EA4335]': selectedChannel.key === 'google',
                                'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'google'
                              }"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        <div class="truncate">Google</div>
                      </a>
                      <a
                        class="cursor-pointer svg-icon-9 font-medium px-4 py-1.5 flex items-center justify-center space-x-2 dark:text-zinc-200"
                        [ngClass]="{
                          'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100':
                            selectedChannel.key === 'tripadvisor',
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600':
                            selectedChannel.key !== 'tripadvisor'
                        }"
                        (click)="goTo('tripadvisor')"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512.2 320.2"
                          width="2500"
                          height="1563"
                          class="flex-none"
                        >
                          <path
                            [ngClass]="{
                              'fill-[#00AF87]': selectedChannel.key === 'tripadvisor',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'tripadvisor'
                            }"
                            d="M128.2 127.9C92.7 127.9 64 156.6 64 192c0 35.4 28.7 64.1 64.1 64.1 35.4 0 64.1-28.7 64.1-64.1.1-35.4-28.6-64.1-64-64.1zm0 110c-25.3 0-45.9-20.5-45.9-45.9s20.5-45.9 45.9-45.9S174 166.7 174 192s-20.5 45.9-45.8 45.9z"
                          />
                          <circle
                            [ngClass]="{
                              'fill-[#00AF87]': selectedChannel.key === 'tripadvisor',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'tripadvisor'
                            }"
                            cx="128.4"
                            cy="191.9"
                            r="31.9"
                          />
                          <path
                            [ngClass]="{
                              'fill-[#00AF87]': selectedChannel.key === 'tripadvisor',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'tripadvisor'
                            }"
                            d="M384.2 127.9c-35.4 0-64.1 28.7-64.1 64.1 0 35.4 28.7 64.1 64.1 64.1 35.4 0 64.1-28.7 64.1-64.1 0-35.4-28.7-64.1-64.1-64.1zm0 110c-25.3 0-45.9-20.5-45.9-45.9s20.5-45.9 45.9-45.9S430 166.7 430 192s-20.5 45.9-45.8 45.9z"
                          />
                          <circle
                            [ngClass]="{
                              'fill-[#00AF87]': selectedChannel.key === 'tripadvisor',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'tripadvisor'
                            }"
                            cx="384.4"
                            cy="191.9"
                            r="31.9"
                          />
                          <path
                            [ngClass]="{
                              'fill-[#00AF87]': selectedChannel.key === 'tripadvisor',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'tripadvisor'
                            }"
                            d="M474.4 101.2l37.7-37.4h-76.4C392.9 29 321.8 0 255.9 0c-66 0-136.5 29-179.3 63.8H0l37.7 37.4C14.4 124.4 0 156.5 0 192c0 70.8 57.4 128.2 128.2 128.2 32.5 0 62.2-12.1 84.8-32.1l43.4 31.9 42.9-31.2-.5-1.2c22.7 20.2 52.5 32.5 85.3 32.5 70.8 0 128.2-57.4 128.2-128.2-.1-35.4-14.6-67.5-37.9-90.7zM368 64.8c-60.7 7.6-108.3 57.6-111.9 119.5-3.7-62-51.4-112.1-112.3-119.5 30.6-22 69.6-32.8 112.1-32.8S337.4 42.8 368 64.8zM128.2 288.2C75 288.2 32 245.1 32 192s43.1-96.2 96.2-96.2 96.2 43.1 96.2 96.2c-.1 53.1-43.1 96.2-96.2 96.2zm256 0c-53.1 0-96.2-43.1-96.2-96.2s43.1-96.2 96.2-96.2 96.2 43.1 96.2 96.2c-.1 53.1-43.1 96.2-96.2 96.2z"
                          />
                        </svg>
                        <div class="truncate">TripAdvisor</div>
                      </a>
                      <a
                        class="cursor-pointer svg-icon-9 font-medium px-4 py-1.5 flex items-center justify-center space-x-2 dark:text-zinc-200"
                        [ngClass]="{
                          'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100':
                            selectedChannel.key === 'thefork',
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600':
                            selectedChannel.key !== 'thefork'
                        }"
                        (click)="goTo('thefork')"
                      >
                        <svg
                          version="1.0"
                          xmlns="http://www.w3.org/2000/svg"
                          width="205.000000pt"
                          height="205.000000pt"
                          viewBox="0 0 205.000000 205.000000"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <g
                            transform="translate(0.000000,205.000000) scale(0.100000,-0.100000)"
                            fill="currentColor"
                            [ngClass]="{
                              'fill-[#00645a]': selectedChannel.key === 'thefork',
                              'fill-zinc-400 dark:fill-zinc-600': selectedChannel.key !== 'thefork'
                            }"
                            stroke="none"
                          >
                            <path
                              d="M842 1839 c-91 -16 -238 -69 -314 -114 -250 -147 -398 -410 -398
                                    -707 0 -181 36 -313 119 -440 123 -188 331 -309 619 -358 63 -11 139 -20 169
                                    -20 l55 0 -7 32 c-25 129 -30 142 -64 178 -25 26 -56 44 -102 59 -119 39 -193
                                    100 -244 201 -46 90 -53 151 -59 528 l-6 352 80 0 79 0 6 -32 c3 -18 25 -171
                                    49 -339 48 -337 52 -350 119 -371 20 -6 39 -9 42 -6 3 2 -27 193 -65 424 -38
                                    230 -70 425 -70 432 0 8 22 12 75 12 69 0 75 -2 80 -22 3 -13 37 -160 75 -328
                                    38 -168 72 -315 75 -327 3 -13 11 -23 19 -23 21 0 66 50 66 73 0 12 -29 139
                                    -65 283 -36 144 -65 265 -65 268 0 3 38 6 83 6 l84 0 37 -107 c185 -528 190
                                    -547 163 -686 -20 -100 -56 -175 -118 -243 -67 -74 -75 -111 -53 -230 10 -52
                                    22 -94 28 -94 28 1 154 64 230 114 184 122 301 306 341 531 19 109 19 202 1
                                    297 -62 320 -280 549 -611 640 -81 23 -364 33 -453 17z"
                            />
                          </g>
                        </svg>

                        <div class="truncate">The Fork</div>
                      </a>
                    </div>
                  </div>
                  @if (selectedChannel.channel; as channelSuggested) { @switch (selectedChannel.key) { @case('google') {
                  <step2-google
                    [image]="channelSuggested.image || ''"
                    [name]="channelSuggested.name || ''"
                    [address]="selectedChannel.address || ''"
                  ></step2-google>
                  } @case ('tripadvisor') {
                  <step2-tripadvisor
                    [image]="channelSuggested.image || ''"
                    [name]="channelSuggested.name || ''"
                    [address]="selectedChannel.address || ''"
                  ></step2-tripadvisor>
                  } @case ('thefork') {
                  <step2-thefork
                    [image]="channelSuggested.image || ''"
                    [name]="channelSuggested.name || ''"
                    [address]="selectedChannel.address || ''"
                  ></step2-thefork>
                  } } } @else {
                  <no-channel></no-channel>
                  }
                </div>
              </div>
              <div
                class="absolute inset-y-0 pointer-events-none"
                style="right:-1.375rem;width:calc(100% - 400px + 1.375rem)"
              >
                <div
                  class="absolute z-10 top-1/2 left-0 p-2 -mt-6 hidden demo-sm:flex items-center justify-center pointer-events-auto cursor-ew-resize"
                  style="_drag-x:0;transform:none;user-select:none;touch-action:pan-y"
                  draggable="false"
                >
                  <div class="w-1.5 h-8 bg-zinc-500/60 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center justify-between mt-14 w-full">
            <button
              type="button"
              class="flex flex-row items-center gap-x-2 rounded-[8px] bg-transparent px-4 h-11 text-sm svg-icon-7 stroke-2 font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30"
              (click)="edit()"
              [disabled]="selectedChannel.key === 'google'"
            >
              @if (selectedChannel.channel?.channel?.api?.url) {
              <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                <title>pen writing</title>
                <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                  <path
                    d="M2.75,15.25s3.599-.568,4.546-1.515,7.327-7.327,7.327-7.327c.837-.837,.837-2.194,0-3.03-.837-.837-2.194-.837-3.03,0,0,0-6.38,6.38-7.327,7.327-.947,.947-1.515,4.546-1.515,4.546h0Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <line
                    x1="9"
                    y1="15.25"
                    x2="15.25"
                    y2="15.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke="currentColor"
                  ></line>
                </g>
              </svg>
              {{ 'EDIT' | translate }}
              } @else {
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
              {{ 'ADD' | translate }}
              }
            </button>

            <button
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px"
              [ngClass]="{
                'shadow-lg shadow-accent/70 dark:shadow-accentDark/70': finalConfirm(),
                'shadow-md shadow-black/20': !finalConfirm()
              }"
              (click)="confirm()"
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
    } } }
  `,
})
export class Step2CompetitorDialog {
  store = inject(CompetitorsStore);
  dialog = inject(AddCompetitorDialogService);
  editDialog = inject(EditChannelDialogService);

  channels = computed(() => this.store.channels());
  index = signal(0);
  finalConfirm = computed(() => this.channels().every((channel) => channel.checked));

  constructor() {
    toObservable(this.editDialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe((isOpen) => this.dialog.isAllowed.set(!isOpen));
  }

  openLink(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  goTo(source: 'google' | 'tripadvisor' | 'thefork') {
    const index = this.channels().findIndex((channel) => channel.key === source);
    this.index.set(index);
    this.store.checkChannelSetup(source);
  }

  edit() {
    const selectedChannel = this.channels()[this.index()];
    this.editDialog.source.set(selectedChannel.key);
    this.editDialog.url.set(selectedChannel.channel?.channel?.api?.url || '');
    this.editDialog.fuction.set((url: string) => {
      if (!url) {
        this.store.removeChannelSetup(selectedChannel.key);
        return;
      }

      this.store.editSetupChannel(selectedChannel.key, url);
    });

    this.editDialog.openDialog();
  }

  confirm() {
    const checked = this.channels().filter((channel) => !channel.checked);
    if (checked.length === 0) {
      this.save();
      return;
    }

    const selectedChannel = checked[0];

    this.goTo(selectedChannel.key);
  }

  private save() {
    const channelsSetup: {
      source: string;
      url: string;
      id: string;
    }[] = this.store
      .channels()
      .map((channel) => ({
        source: channel.key,
        url: channel.channel?.channel?.api?.url || '',
        id: '',
      }))
      .filter((channel) => channel.url);

    this.store.saveChannelsSetup(channelsSetup);
    this.dialog.closeDialog();
  }
}
