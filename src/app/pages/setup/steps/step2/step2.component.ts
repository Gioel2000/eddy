import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { GoogleStep2Component } from './ui/google.component';
import { TripadvisorStep2Component } from './ui/tripadvisor.component';
import { TheForkStep2Component } from './ui/thefork.component';
import { NoChannelComponent } from './ui/no-channel.component';
import { EditChannelDialogService } from '../../ui/edit-channel-dialog/edit-channel-dialog.service';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';
import moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'step2',
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
    GoogleStep2Component,
    TripadvisorStep2Component,
    TheForkStep2Component,
    NoChannelComponent,
    MissingTranslationPipe,
  ],
  template: `
    <ng-template #loading>
      <div class="col-span-1 px-6 pb-24 pt-8 sm:pt-44 sm:pb-32 lg:px-8 lg:min-h-screen">
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

    <div class="relative isolate bg-white dark:bg-dark">
      <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 w-full">
        <stepper></stepper>
        @switch (store.channelsState()) { @case ('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case ('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @case ('loaded') { @if (channels()[index()]; as selectedChannel) {
        <div class="col-span-1 px-6 pb-24 pt-16 sm:pb-32 lg:px-8 lg:min-h-screen">
          <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div class="flex flex-row items-center gap-x-2 cursor-pointer">
              @switch (selectedChannel.key) { @case('google') {
              <div class="pb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="50"
                  class="relative -left-4"
                  viewBox="-40.446 -22.19 350.532 133.14"
                >
                  <path
                    d="M115.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                    fill="#EA4335"
                  />
                  <path
                    d="M163.39 46.71c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M209.39 25.87v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
                    fill="#4285F4"
                  />
                  <path d="M224.64 2.53v65h-9.5v-65z" fill="#34A853" />
                  <path
                    d="M261.66 54.01l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
                    fill="#EA4335"
                  />
                  <path
                    d="M34.93 40.94v-9.41h31.71c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C15.96 68.88 0 53.42 0 34.44 0 15.46 15.96 0 34.94 0c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65z"
                    fill="#4285F4"
                  />
                </svg>
              </div>
              } @case ('tripadvisor') {
              <div class="pb-[39px]">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 3354.111 713.496"
                  enable-background="new 0 0 3354.111 713.496"
                  xml:space="preserve"
                  height="35"
                >
                  <g>
                    <path
                      class="fill-zinc-900 dark:fill-zinc-200 text-zinc-900 dark:text-zinc-200"
                      d="M3335.258,476.767c-10.404,0-18.854,8.45-18.854,18.854c0,10.404,8.449,18.854,18.854,18.854   c10.402,0,18.854-8.45,18.854-18.854C3354.111,485.217,3345.66,476.767,3335.258,476.767z M3335.258,511.485   c-8.77,0-15.865-7.136-15.865-15.864c0-8.77,7.135-15.864,15.865-15.864c8.77,0,15.904,7.135,15.904,15.864   C3351.162,504.35,3344.027,511.485,3335.258,511.485z M3341.396,492.392c0-3.428-2.432-5.461-6.02-5.461h-6.02v17.18h2.949v-6.218   h3.229l3.109,6.218h3.189l-3.428-6.855C3340.24,496.418,3341.396,494.743,3341.396,492.392z M3335.258,495.222h-2.91v-5.699h2.91   c1.992,0,3.188,0.996,3.188,2.83C3338.445,494.226,3337.211,495.222,3335.258,495.222z M1063.508,285.956v-45.6h-69.914v271.288   h69.914V348.976c0-29.457,18.894-43.927,48.351-43.927h38.266v-64.692h-32.686C1091.849,240.356,1069.607,253.709,1063.508,285.956   z M1215.615,133.053c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C1257.866,151.946,1239.531,133.053,1215.615,133.053z M1180.737,511.645h69.756V240.356h-69.756V511.645z M1582.766,376   c0,77.448-62.779,140.229-140.228,140.229c-31.251,0-59.591-10.244-82.312-27.544v102.601h-69.755V240.356h69.755v22.959   c22.721-17.299,51.061-27.543,82.312-27.543C1519.987,235.772,1582.766,298.552,1582.766,376z M1512.573,376   c0-42.052-34.12-76.173-76.173-76.173s-76.173,34.121-76.173,76.173c0,42.053,34.121,76.173,76.173,76.173   C1478.453,452.173,1512.573,418.093,1512.573,376z M2795.152,352.204l-40.697-11.161c-26.785-6.976-37.189-15.187-37.189-29.337   c0-13.792,14.668-23.438,35.635-23.438c19.971,0,35.635,13.074,35.635,29.815v1.554h64.295v-1.554   c0-49.228-40.139-82.312-99.93-82.312c-59.191,0-102.201,33.044-102.201,78.604c0,35.436,23.477,62.142,64.453,73.223   l38.984,10.643c29.615,8.211,40.617,17.3,40.617,33.603c0,17.18-15.904,28.739-39.582,28.739   c-24.674,0-41.295-15.626-41.295-38.824v-1.555h-68.24v1.555c0,55.645,44.803,94.548,108.979,94.548   c61.822,0,106.705-37.986,106.705-90.283C2861.32,400.354,2849.84,366.793,2795.152,352.204z M1830.219,240.356h69.754v271.288   h-69.754v-22.96c-22.721,17.3-51.062,27.544-82.312,27.544c-77.447,0-140.227-62.78-140.227-140.229s62.78-140.228,140.227-140.228   c31.25,0,59.592,10.244,82.312,27.543V240.356z M1830.219,376L1830.219,376c0-42.092-34.121-76.173-76.174-76.173   s-76.172,34.121-76.172,76.173c0,42.053,34.119,76.173,76.172,76.173C1796.137,452.173,1830.219,418.093,1830.219,376z    M2151.85,143.815h69.756v367.869h-69.756v-22.96c-22.721,17.3-51.061,27.544-82.311,27.544   c-77.449,0-140.229-62.78-140.229-140.229s62.779-140.228,140.229-140.228c31.25,0,59.59,10.244,82.311,27.543V143.815z    M2151.85,376c0-42.052-34.121-76.173-76.174-76.173c-42.051,0-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C2117.729,452.173,2151.85,418.093,2151.85,376z M2545.469,511.645h69.754V240.356h-69.754V511.645z M2580.346,133.053   c-23.916,0-42.252,18.894-42.252,42.81c0,23.358,18.336,42.252,42.252,42.252s42.252-18.894,42.252-42.252   C2622.598,151.946,2604.262,133.053,2580.346,133.053z M3162.822,376c0,77.448-62.779,140.229-140.229,140.229   c-77.447,0-140.227-62.78-140.227-140.229s62.779-140.228,140.227-140.228C3100.043,235.772,3162.822,298.552,3162.822,376z    M3098.768,376c0-42.052-34.121-76.173-76.174-76.173s-76.172,34.121-76.172,76.173c0,42.053,34.08,76.173,76.172,76.173   C3064.646,452.173,3098.768,418.093,3098.768,376z M1027.793,143.815H760.212v62.222h99.053v305.607h69.516V206.037h99.053v-62.222   H1027.793z M2381.006,437.345l-62.062-196.988h-73.264l93.074,271.288h83.945l93.631-271.288h-73.264L2381.006,437.345z    M3265.023,285.956v-45.6h-69.914v271.288h69.914V348.976c0-29.457,18.895-43.927,48.35-43.927h38.266v-64.692h-32.684   C3293.363,240.356,3271.162,253.709,3265.023,285.956z"
                    />
                    <circle fill="#34E0A1" cx="356.749" cy="356.748" r="356.748" />
                    <path
                      d="M577.095,287.152l43.049-46.836h-95.465c-47.792-32.646-105.51-51.659-167.931-51.659   c-62.342,0-119.899,19.054-167.612,51.659H93.432l43.049,46.836c-26.387,24.075-42.929,58.754-42.929,97.259   c0,72.665,58.914,131.578,131.579,131.578c34.519,0,65.968-13.313,89.446-35.077l42.172,45.919l42.172-45.879   c23.478,21.764,54.887,35.037,89.406,35.037c72.665,0,131.658-58.913,131.658-131.578   C620.024,345.866,603.483,311.188,577.095,287.152z M225.17,473.458c-49.188,0-89.047-39.859-89.047-89.047   s39.86-89.048,89.047-89.048c49.187,0,89.047,39.86,89.047,89.048S274.357,473.458,225.17,473.458z M356.788,381.82   c0-58.595-42.61-108.898-98.853-130.383c30.413-12.716,63.776-19.771,98.813-19.771s68.439,7.055,98.853,19.771   C399.399,272.962,356.788,323.226,356.788,381.82z M488.367,473.458c-49.188,0-89.048-39.859-89.048-89.047   s39.86-89.048,89.048-89.048s89.047,39.86,89.047,89.048S537.554,473.458,488.367,473.458z M488.367,337.694   c-25.79,0-46.677,20.887-46.677,46.677c0,25.789,20.887,46.676,46.677,46.676c25.789,0,46.676-20.887,46.676-46.676   C535.042,358.621,514.156,337.694,488.367,337.694z M271.846,384.411c0,25.789-20.887,46.676-46.676,46.676   s-46.676-20.887-46.676-46.676c0-25.79,20.887-46.677,46.676-46.677C250.959,337.694,271.846,358.621,271.846,384.411z"
                    />
                  </g>
                </svg>
              </div>
              } @case ('thefork') {
              <svg
                version="1.1"
                id="katman_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 841.89 595.28"
                style="enable-background:new 0 0 841.89 595.28;"
                xml:space="preserve"
                height="122"
                class="relative -left-4 -top-12 -mb-12"
              >
                <style type="text/css">
                  .st0 {
                    fill: #00665c;
                  }
                  .st1 {
                    fill-rule: evenodd;
                    clip-rule: evenodd;
                    fill: #00665c;
                  }
                </style>
                <g>
                  <path class="st0" d="M74.35,264h32.03v79.09h18.16V264h32.15v-13.62H74.35V264z" />
                  <path
                    class="st0"
                    d="M182.55,250.43h-17.67v92.67h17.67v-33.87c0-16.69,11.41-26.88,21.72-26.88c7,0,12.15,4.54,12.15,13.74v47
                      h17.67v-52.65c0-14.97-9.94-22.21-21.72-22.21c-12.15,0-24.91,8.1-29.82,23.07V250.43z"
                  />
                  <path
                    class="st1"
                    d="M242.72,305.79c0-18.78,12.03-37.55,36.32-37.55c19.64,0,30.07,11.9,30.07,34.24v3.44h-51.54
                    c1.96,11.66,10.92,20.86,26.02,20.86c9.08,0,18.78-3.31,26.75-9.69v17.3c-9.08,6.75-19.39,10.06-29.58,10.06
                    C256.96,344.44,242.72,326.9,242.72,305.79z M291.19,297.32c0-12.39-5.03-18.53-14.48-18.53c-11.29,0-17.92,8.59-19.27,18.53
                    H291.19z"
                  />
                  <path class="st0" d="M385.25,250.38h-65.9v92.71h18.29v-42.52h41.48v-13.62h-41.48V264h47.61V250.38z" />
                  <path
                    class="st1"
                    d="M386.9,306.52c0-19.02,13.62-38.29,39.88-38.29c25.77,0,39.15,18.9,39.15,37.92
                    c0,19.14-13.62,38.29-39.88,38.29C400.4,344.44,386.9,325.42,386.9,306.52z M427.28,330.82c13.5,0,20.62-10.8,20.62-23.56
                    c0-13.38-7.73-25.4-22.33-25.4c-13.5,0-20.62,10.8-20.62,23.44C404.94,318.8,412.67,330.82,427.28,330.82z"
                  />
                  <path
                    class="st0"
                    d="M490.88,269.46h-16.32v73.63h17.67v-44.42c3.68-9.08,12.39-13.99,21.35-13.99c4.79,0,9.82,1.35,13.62,4.05
                    v-17.3c-2.95-1.84-6.75-2.94-10.55-2.94c-11.04,0-21.84,6.99-25.77,23.68V269.46z"
                  />
                  <path
                    class="st0"
                    d="M569.43,299.19l35.04-37.31h-20.04l-30.55,31.51l-0.01-43.01h-17.66v92.71H554l-0.13-37.81
                      c0,0,29.28-0.72,29.28,37.81h19.15C602.31,305.79,569.43,299.19,569.43,299.19z"
                  />
                </g>
                <path
                  class="st0"
                  d="M619.8,298.04c0.04-34.31,25.25-68.83,74.87-68.83c48.33,0,73.49,34.91,72.93,67.97
                  c-0.66,38.32-26.2,58.15-49.08,65.27l-2.61-11.43c-1.36-5.99,0.26-11.33,4.5-15.11c5.47-4.88,8.74-10.92,10.43-19.27
                  c1.79-8.83,0.95-18.52-3.03-28.2l-13.53-38.06h-13.58l10.85,43.48c0.99,4.33-2.3,8.46-6.74,8.46l-13.18-57.81h-12.34l11.87,71.35
                  c-7.43,0.67-10.19-4.15-10.8-7.64l-7.57-53.88h-12.54c0,0,0.08,29.03,0.08,48.85c0,29.14,15.57,37.81,26.33,40.4
                  c6.08,1.46,10.15,6.19,11.25,12.84l1.53,9.18C676.39,365.66,619.73,357.08,619.8,298.04z"
                />
              </svg>
              } }
            </div>
            <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ 'CONFIGURE_CHANNELS' | translate }}
            </h2>
            <p class="mt-6 text-lg leading-8 text-zinc-600">
              {{ 'CHECK_CHANNEL' | translate }}
            </p>

            <div class="max-w-7xl mx-auto mt-6">
              <div class="demo-sm:-mt-24 xl:mt-0">
                <div class="relative">
                  <div
                    class="shadow-xl shadow-black/10 rounded-xl min-w-full max-w-full demo-sm:min-w-0 demo-sm:max-w-none w-full"
                  >
                    <div class="rounded-xl ring-1 ring-zinc-900/10">
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
                              class="bg-zinc-100 hover:bg-zinc-50 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-zinc-900/5 mx-auto w-4/5 dark:bg-zinc-800 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-500 transition ease-in-out duration-200 transform"
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
                              class="flex flex-col items-center justify-center rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ease-in-out duration-200 transform"
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
                      @if (selectedChannel.channel; as channelSuggested) { @switch (selectedChannel.key) {
                      @case('google') {
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
                  class="flex flex-row items-center gap-x-2 rounded-[8px] bg-transparent px-4 h-11 text-sm svg-icon-7 stroke-2 font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-30"
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
                  class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] h-11 transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px"
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
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        } } }
      </div>

      <footer class="bg-zinc-100 dark:bg-[#1A1A1A] border-t border-zinc-300 dark:border-zinc-800">
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
export class Step2Component {
  store = inject(StructureStore);
  router = inject(Router);
  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  dialog = inject(EditChannelDialogService);

  isLoading = signal<boolean>(false);
  channels = computed(() => this.store.channelsSetup());
  index = signal(0);
  finalConfirm = computed(() => this.channels().every((channel) => channel.checked));

  readonly currentYear = moment(new Date()).year();

  constructor() {
    setTimeout(() => this.store.loadSuggestedChannels(), 0);
  }

  goTo(source: 'google' | 'tripadvisor' | 'thefork') {
    const index = this.channels().findIndex((channel) => channel.key === source);
    this.index.set(index);
    this.store.checkChannelSetup(source);
  }

  openLink(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  edit() {
    const selectedChannel = this.channels()[this.index()];
    this.dialog.source.set(selectedChannel.key);
    this.dialog.url.set(selectedChannel.channel?.channel?.api?.url || '');
    this.dialog.fuction.set((url: string) => {
      if (!url) {
        console.log('remove', selectedChannel.key);
        // this.store.removeChannelSetup(selectedChannel.key);
        return;
      }

      // this.store.editSetupChannel(selectedChannel.key, url);
    });

    this.dialog.openDialog();
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
      .channelsSetup()
      .map((channel) => ({
        source: channel.key,
        url: channel.channel?.channel?.api?.url || '',
        id: '',
      }))
      .filter((channel) => channel.url);

    // this.store.saveChannelsSetup(channelsSetup);
  }
}
