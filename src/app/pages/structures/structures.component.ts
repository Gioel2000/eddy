import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SettingsService } from '../../ui/settings/settings.service';
import { UserPanelService } from '../../ui/user/user.service';
import { RestaurantPanelService } from '../../ui/create-restaurant/create-restaurant.service';
import { StructureStore } from '../../store/structures/structure.service';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { MissingTranslationPipe } from '../../utils/pipes/missingTranslation.pipe';
import { RouterModule } from '@angular/router';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'choose-restaurant',
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    LoaderComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    MissingTranslationPipe,
    RouterModule,
  ],
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
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #loaded>
      <div
        id="loaded"
        class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        @for (structure of store.structures(); track $index) { @defer (on viewport; prefetch on idle) {
        <article
          class="flex flex-col items-start justify-between rounded-2xl bg-white dark:bg-[#1a1a1a] ring-1 ring-inset ring-zinc-300 dark:ring-[#2f2f2f]"
        >
          <div class="relative w-full">
            <img
              [ngSrc]="structure.image"
              alt=""
              width="768"
              height="432"
              priority
              class="aspect-[16/9] w-full rounded-t-2xl bg-zinc-100 dark:bg-zinc-900 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            />
            <div class="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-zinc-900/10"></div>
          </div>
          <div class="w-full p-6">
            <div class="flex items-center gap-x-4 text-xs">
              <span class="text-zinc-500">{{ structure.address }}, {{ structure.zipCode }}, {{ structure.city }}</span>
            </div>
            <div class="relative">
              <h3 class="mt-3 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                <a>
                  <span class="absolute inset-0"></span>
                  {{ structure.name }}
                </a>
              </h3>

              <div class="flex flex-col mt-5 gap-y-2">
                <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                  {{ structure.email }}
                </div>
                <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                  {{ structure.telephone }}
                </div>
                <div class="line-clamp-3 text-sm leading-4 text-zinc-600 dark:text-zinc-400">
                  {{ structure.website }}
                </div>
              </div>
            </div>
            <div
              class="bg-accent dark:bg-accentDark rounded-lg relative mt-8 flex items-center gap-x-4 opacity-90 hover:opacity-100 transition ease-in-out duration-200 animate-blurToClear200"
            >
              <button
                [id]="'choose-structure-' + structure._id"
                class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] w-full h-full ring-1 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-white/40 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/20 hover:shadow-black/30 disabled:opacity-30"
                (click)="store.choose(structure._id)"
              >
                <div
                  class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
                >
                  <span class="font-semibold text-base">{{ 'CHOOSE' | translate }}</span>
                </div>
              </button>
            </div>
          </div>
        </article>
        } @placeholder {
        <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[34rem]">
          <loader></loader>
        </div>
        } @loading {
        <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[34rem]">
          <loader></loader>
        </div>
        } }
      </div>
    </ng-template>

    <div class="bg-zinc-50 dark:bg-[#141414] py-12 sm:py-24 min-h-screen">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="pb-12">
          <a class="flex flex-row items-center cursor-pointer font-[Pacifico] text-3xl font-medium">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="100%"
              viewBox="0 0 384 214"
              enable-background="new 0 0 384 214"
              xml:space="preserve"
              class="text-transparent w-20 h-20"
            >
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M285.000000,237.000000 
                    C190.000031,237.000000 95.500053,237.000000 1.000063,237.000000 
                    C1.000042,158.333389 1.000042,79.666771 1.000021,1.000116 
                    C128.999908,1.000077 256.999817,1.000077 384.999817,1.000039 
                    C384.999878,79.666557 384.999878,158.333115 384.999939,236.999832 
                    C351.833344,237.000000 318.666656,237.000000 285.000000,237.000000 
                  M271.850616,220.491821 
                    C275.559448,215.648270 280.644196,211.323822 282.705994,205.858887 
                    C287.847412,192.231537 291.545227,178.063385 296.009369,164.172379 
                    C296.656799,162.157822 297.942047,159.936630 299.600830,158.731369 
                    C306.062622,154.036224 312.799591,149.720413 319.421082,145.244049 
                    C321.488800,143.846207 323.656372,142.549240 325.527924,140.918762 
                    C328.482056,138.345139 329.551331,131.103302 327.183380,128.489258 
                    C323.615417,124.550522 320.548676,127.819954 317.636536,129.774338 
                    C311.857605,133.652679 306.190247,137.697235 299.992096,142.010361 
                    C300.187653,140.155197 300.260651,138.874268 300.465088,137.614670 
                    C302.570892,124.638069 304.770935,111.676224 306.786102,98.685669 
                    C307.693939,92.833336 306.124939,91.125595 300.610962,91.267227 
                    C294.193787,91.432060 291.996307,93.566856 289.473602,100.588409 
                    C285.829468,110.731422 282.057404,120.846596 277.795837,130.739273 
                    C276.417053,133.939987 274.443634,138.806534 269.973022,137.347549 
                    C268.543457,136.881012 268.094482,130.780167 268.609802,127.477715 
                    C270.146790,117.627655 272.420593,107.893974 274.333954,98.100647 
                    C275.321686,93.045044 273.849426,91.358421 268.700134,91.366035 
                    C261.213715,91.377106 257.656830,93.447777 256.064850,100.774948 
                    C253.637726,111.946060 251.787811,123.269012 250.313248,134.608170 
                    C249.687820,139.417511 246.567825,141.235001 243.088120,142.414169 
                    C241.224579,143.045654 238.001511,142.289597 236.529541,140.929001 
                    C233.001999,137.668427 232.818298,129.178619 234.886139,124.663231 
                    C242.280334,108.517059 250.143524,92.535233 256.500061,75.980835 
                    C261.272583,63.551765 263.639160,50.284367 261.058167,36.752495 
                    C259.871124,30.528858 257.089478,25.244982 250.466797,23.520615 
                    C243.739212,21.768930 238.068649,24.482885 234.272614,29.822397 
                    C230.945099,34.502876 227.675919,39.686104 226.211395,45.138885 
                    C222.557709,58.742546 220.018005,72.642799 216.822220,86.375381 
                    C216.427628,88.071060 214.964813,90.608009 213.658737,90.838516 
                    C193.507935,94.394882 178.044052,113.941162 178.980591,136.476379 
                    C179.140686,140.328964 177.620941,141.970764 174.394974,142.861450 
                    C170.854675,143.838928 168.402466,142.231796 167.219635,139.105774 
                    C165.267014,133.945328 164.536209,129.176895 167.350952,123.440781 
                    C175.095291,107.658775 182.503632,91.636711 188.737350,75.213326 
                    C193.403763,62.919144 195.654922,49.792068 193.009628,36.452435 
                    C191.817612,30.441406 189.044022,25.323929 182.654587,23.569279 
                    C176.155991,21.784649 170.506348,24.168985 166.744980,29.313826 
                    C163.261353,34.078762 159.799683,39.365635 158.271667,44.954021 
                    C154.557144,58.539165 151.939926,72.426147 148.962646,86.209244 
                    C148.478561,88.450363 148.739807,90.429352 145.411713,91.161171 
                    C125.357880,95.570847 111.803314,111.795113 111.072937,132.290909 
                    C110.941322,135.984146 109.517181,137.345703 106.323700,137.784988 
                    C96.442451,139.144196 86.572983,141.441284 76.675446,141.570236 
                    C68.193985,141.680695 59.279400,140.484161 51.274155,137.757935 
                    C39.132374,133.623016 37.376770,119.308777 47.701195,111.588715 
                    C51.820412,108.508583 57.058372,106.568672 62.081188,105.154190 
                    C66.988731,103.772163 72.285019,103.814949 77.385048,103.059372 
                    C82.304131,102.330612 84.269890,99.150024 84.301651,93.213860 
                    C84.327888,88.309219 81.157921,87.638092 77.428993,87.220688 
                    C73.964157,86.832840 70.422058,86.605400 67.089996,85.676155 
                    C60.928295,83.957794 56.210445,80.265450 55.266109,73.558693 
                    C54.316124,66.811844 57.253700,61.426239 62.907982,57.854271 
                    C71.400520,52.489296 80.740013,51.665787 90.294495,54.137882 
                    C95.609177,55.512978 98.244766,59.462437 98.027672,64.948044 
                    C97.883240,68.597610 96.716064,72.296524 97.120163,75.846596 
                    C97.392143,78.235970 99.069099,81.366669 101.060608,82.482513 
                    C106.126648,85.321007 112.213318,82.877228 115.087341,77.702576 
                    C120.117371,68.646057 118.485802,54.504250 111.616417,46.743664 
                    C105.304916,39.613323 96.967896,37.250496 87.943153,36.642899 
                    C70.941856,35.498272 54.995136,38.191158 42.065144,50.461609 
                    C29.255772,62.617599 29.384434,85.665962 47.724434,93.420097 
                    C47.888367,93.489410 47.879856,93.966576 47.969204,94.322426 
                    C44.783489,95.620918 41.516243,96.770782 38.406414,98.251305 
                    C24.005239,105.107361 16.471624,119.425369 20.002481,133.848206 
                    C23.165161,146.767090 33.194618,152.664932 44.847328,155.900574 
                    C67.608986,162.220856 90.351105,160.049286 113.002876,154.718781 
                    C114.795143,154.297028 117.329651,154.502228 118.764030,155.500793 
                    C127.474243,161.564636 138.419434,161.084595 146.301132,153.864151 
                    C148.350693,151.986542 150.231369,149.924561 152.227692,147.908798 
                    C161.613480,161.872818 167.786285,162.980881 184.994614,153.892822 
                    C190.261475,158.875031 196.840530,161.417419 203.677094,158.913803 
                    C209.799728,156.671646 215.218994,152.508835 221.043655,149.138382 
                    C229.832748,162.109833 237.899033,163.324707 253.629822,153.087158 
                    C257.397369,158.148010 262.512909,161.742279 268.590302,158.886475 
                    C273.681732,156.493988 277.775574,151.978561 281.808563,148.799301 
                    C282.279266,154.774063 281.471222,155.660797 276.456512,160.300964 
                    C267.680481,168.421539 258.910400,176.619125 250.900238,185.474136 
                    C244.680984,192.349396 242.141876,201.079147 242.920227,210.502960 
                    C243.497330,217.490128 248.620407,222.991089 255.494278,224.076843 
                    C261.120514,224.965546 266.443848,224.199570 271.850616,220.491821 
                  M371.288269,139.601837 
                    C369.443634,133.740753 364.486389,132.706772 359.430267,132.432877 
                    C354.218170,132.150528 349.406647,133.597168 346.781036,138.663300 
                    C344.017761,143.994858 343.707245,149.559875 346.982300,154.781601 
                    C349.933777,159.487442 354.828766,160.056381 359.784058,159.555374 
                    C369.075745,158.615891 373.220245,151.742676 371.288269,139.601837 
                  z"
              />
              <path
                class="fill-accent dark:fill-accentDark"
                opacity="1.000000"
                stroke="none"
                d="
                  M271.546570,220.698456 
                    C266.443848,224.199570 261.120514,224.965546 255.494278,224.076843 
                    C248.620407,222.991089 243.497330,217.490128 242.920227,210.502960 
                    C242.141876,201.079147 244.680984,192.349396 250.900238,185.474136 
                    C258.910400,176.619125 267.680481,168.421539 276.456512,160.300964 
                    C281.471222,155.660797 282.279266,154.774063 281.808563,148.799301 
                    C277.775574,151.978561 273.681732,156.493988 268.590302,158.886475 
                    C262.512909,161.742279 257.397369,158.148010 253.629822,153.087158 
                    C237.899033,163.324707 229.832748,162.109833 221.043655,149.138382 
                    C215.218994,152.508835 209.799728,156.671646 203.677094,158.913803 
                    C196.840530,161.417419 190.261475,158.875031 184.994614,153.892822 
                    C167.786285,162.980881 161.613480,161.872818 152.227692,147.908798 
                    C150.231369,149.924561 148.350693,151.986542 146.301132,153.864151 
                    C138.419434,161.084595 127.474243,161.564636 118.764030,155.500793 
                    C117.329651,154.502228 114.795143,154.297028 113.002876,154.718781 
                    C90.351105,160.049286 67.608986,162.220856 44.847328,155.900574 
                    C33.194618,152.664932 23.165161,146.767090 20.002481,133.848206 
                    C16.471624,119.425369 24.005239,105.107361 38.406414,98.251305 
                    C41.516243,96.770782 44.783489,95.620918 47.969204,94.322426 
                    C47.879856,93.966576 47.888367,93.489410 47.724434,93.420097 
                    C29.384434,85.665962 29.255772,62.617599 42.065144,50.461609 
                    C54.995136,38.191158 70.941856,35.498272 87.943153,36.642899 
                    C96.967896,37.250496 105.304916,39.613323 111.616417,46.743664 
                    C118.485802,54.504250 120.117371,68.646057 115.087341,77.702576 
                    C112.213318,82.877228 106.126648,85.321007 101.060608,82.482513 
                    C99.069099,81.366669 97.392143,78.235970 97.120163,75.846596 
                    C96.716064,72.296524 97.883240,68.597610 98.027672,64.948044 
                    C98.244766,59.462437 95.609177,55.512978 90.294495,54.137882 
                    C80.740013,51.665787 71.400520,52.489296 62.907982,57.854271 
                    C57.253700,61.426239 54.316124,66.811844 55.266109,73.558693 
                    C56.210445,80.265450 60.928295,83.957794 67.089996,85.676155 
                    C70.422058,86.605400 73.964157,86.832840 77.428993,87.220688 
                    C81.157921,87.638092 84.327888,88.309219 84.301651,93.213860 
                    C84.269890,99.150024 82.304131,102.330612 77.385048,103.059372 
                    C72.285019,103.814949 66.988731,103.772163 62.081188,105.154190 
                    C57.058372,106.568672 51.820412,108.508583 47.701195,111.588715 
                    C37.376770,119.308777 39.132374,133.623016 51.274155,137.757935 
                    C59.279400,140.484161 68.193985,141.680695 76.675446,141.570236 
                    C86.572983,141.441284 96.442451,139.144196 106.323700,137.784988 
                    C109.517181,137.345703 110.941322,135.984146 111.072937,132.290909 
                    C111.803314,111.795113 125.357880,95.570847 145.411713,91.161171 
                    C148.739807,90.429352 148.478561,88.450363 148.962646,86.209244 
                    C151.939926,72.426147 154.557144,58.539165 158.271667,44.954021 
                    C159.799683,39.365635 163.261353,34.078762 166.744980,29.313826 
                    C170.506348,24.168985 176.155991,21.784649 182.654587,23.569279 
                    C189.044022,25.323929 191.817612,30.441406 193.009628,36.452435 
                    C195.654922,49.792068 193.403763,62.919144 188.737350,75.213326 
                    C182.503632,91.636711 175.095291,107.658775 167.350952,123.440781 
                    C164.536209,129.176895 165.267014,133.945328 167.219635,139.105774 
                    C168.402466,142.231796 170.854675,143.838928 174.394974,142.861450 
                    C177.620941,141.970764 179.140686,140.328964 178.980591,136.476379 
                    C178.044052,113.941162 193.507935,94.394882 213.658737,90.838516 
                    C214.964813,90.608009 216.427628,88.071060 216.822220,86.375381 
                    C220.018005,72.642799 222.557709,58.742546 226.211395,45.138885 
                    C227.675919,39.686104 230.945099,34.502876 234.272614,29.822397 
                    C238.068649,24.482885 243.739212,21.768930 250.466797,23.520615 
                    C257.089478,25.244982 259.871124,30.528858 261.058167,36.752495 
                    C263.639160,50.284367 261.272583,63.551765 256.500061,75.980835 
                    C250.143524,92.535233 242.280334,108.517059 234.886139,124.663231 
                    C232.818298,129.178619 233.001999,137.668427 236.529541,140.929001 
                    C238.001511,142.289597 241.224579,143.045654 243.088120,142.414169 
                    C246.567825,141.235001 249.687820,139.417511 250.313248,134.608170 
                    C251.787811,123.269012 253.637726,111.946060 256.064850,100.774948 
                    C257.656830,93.447777 261.213715,91.377106 268.700134,91.366035 
                    C273.849426,91.358421 275.321686,93.045044 274.333954,98.100647 
                    C272.420593,107.893974 270.146790,117.627655 268.609802,127.477715 
                    C268.094482,130.780167 268.543457,136.881012 269.973022,137.347549 
                    C274.443634,138.806534 276.417053,133.939987 277.795837,130.739273 
                    C282.057404,120.846596 285.829468,110.731422 289.473602,100.588409 
                    C291.996307,93.566856 294.193787,91.432060 300.610962,91.267227 
                    C306.124939,91.125595 307.693939,92.833336 306.786102,98.685669 
                    C304.770935,111.676224 302.570892,124.638069 300.465088,137.614670 
                    C300.260651,138.874268 300.187653,140.155197 299.992096,142.010361 
                    C306.190247,137.697235 311.857605,133.652679 317.636536,129.774338 
                    C320.548676,127.819954 323.615417,124.550522 327.183380,128.489258 
                    C329.551331,131.103302 328.482056,138.345139 325.527924,140.918762 
                    C323.656372,142.549240 321.488800,143.846207 319.421082,145.244049 
                    C312.799591,149.720413 306.062622,154.036224 299.600830,158.731369 
                    C297.942047,159.936630 296.656799,162.157822 296.009369,164.172379 
                    C291.545227,178.063385 287.847412,192.231537 282.705994,205.858887 
                    C280.644196,211.323822 275.559448,215.648270 271.546570,220.698456 
                  M214.023102,106.933502 
                    C204.954590,110.550354 200.471710,118.012634 198.374329,126.874557 
                    C197.419342,130.909607 197.572571,135.509567 198.505356,139.557831 
                    C198.954651,141.507751 202.227707,143.809021 204.480560,144.128464 
                    C208.888748,144.753540 216.138504,136.758942 215.966095,132.174026 
                    C215.653732,123.866898 215.204956,115.564903 214.023102,106.933502 
                  M147.643555,128.762146 
                    C147.314362,121.544403 146.985168,114.326653 146.655807,107.105095 
                    C138.637329,107.770409 129.670135,121.916878 129.773666,130.722244 
                    C129.780792,131.328384 130.286255,131.912415 130.445724,132.535950 
                    C131.004532,134.721039 131.880539,136.905014 131.964478,139.114914 
                    C132.138336,143.690063 134.665207,145.525772 138.982239,143.806503 
                    C143.893173,141.850708 148.172760,134.956635 147.643555,128.762146 
                  M168.155869,96.726517 
                    C170.288712,91.156136 172.683380,85.669617 174.499969,79.997948 
                    C178.301758,68.128166 181.784439,56.144047 180.065842,43.434505 
                    C179.807831,41.526436 178.820557,39.716976 178.170624,37.861900 
                    C177.566223,37.910931 176.961823,37.959957 176.357407,38.008984 
                    C167.191406,57.547379 167.999481,78.957130 164.899750,99.633690 
                    C165.309113,99.770218 165.718475,99.906746 166.127838,100.043274 
                    C166.721893,99.182152 167.315948,98.321037 168.155869,96.726517 
                  M235.945236,72.373413 
                    C234.967407,81.515587 233.989594,90.657761 233.011765,99.799934 
                    C241.777954,89.097679 250.004440,57.228107 248.270432,44.661526 
                    C247.952545,42.357761 247.097656,40.128094 246.490662,37.864220 
                    C245.932449,37.881451 245.374237,37.898682 244.816025,37.915909 
                    C238.468796,48.127415 237.971252,60.013897 235.945236,72.373413 
                  M273.958252,188.419907 
                    C275.015808,184.467194 276.073334,180.514465 277.519592,175.108704 
                    C268.209839,183.554016 260.078308,190.996796 257.766602,202.430832 
                    C257.331879,204.580917 259.017792,207.159744 259.725128,209.540726 
                    C261.773315,208.473785 264.744965,207.929749 265.699707,206.243652 
                    C268.789459,200.786896 271.138519,194.910767 273.958252,188.419907 
                  z"
              />
              <path
                class="fill-zinc-800 dark:fill-zinc-200"
                opacity="1.000000"
                stroke="none"
                d="
                  M371.434906,139.988342 
                    C373.220245,151.742676 369.075745,158.615891 359.784058,159.555374 
                    C354.828766,160.056381 349.933777,159.487442 346.982300,154.781601 
                    C343.707245,149.559875 344.017761,143.994858 346.781036,138.663300 
                    C349.406647,133.597168 354.218170,132.150528 359.430267,132.432877 
                    C364.486389,132.706772 369.443634,133.740753 371.434906,139.988342 
                  z"
              />
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M214.418121,107.097137 
                    C215.204956,115.564903 215.653732,123.866898 215.966095,132.174026 
                    C216.138504,136.758942 208.888748,144.753540 204.480560,144.128464 
                    C202.227707,143.809021 198.954651,141.507751 198.505356,139.557831 
                    C197.572571,135.509567 197.419342,130.909607 198.374329,126.874557 
                    C200.471710,118.012634 204.954590,110.550354 214.418121,107.097137 
                  z"
              />
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M147.711517,129.198532 
                    C148.172760,134.956635 143.893173,141.850708 138.982239,143.806503 
                    C134.665207,145.525772 132.138336,143.690063 131.964478,139.114914 
                    C131.880539,136.905014 131.004532,134.721039 130.445724,132.535950 
                    C130.286255,131.912415 129.780792,131.328384 129.773666,130.722244 
                    C129.670135,121.916878 138.637329,107.770409 146.655807,107.105095 
                    C146.985168,114.326653 147.314362,121.544403 147.711517,129.198532 
                  z"
              />
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M168.032928,97.093216 
                    C167.315948,98.321037 166.721893,99.182152 166.127838,100.043274 
                    C165.718475,99.906746 165.309113,99.770218 164.899750,99.633690 
                    C167.999481,78.957130 167.191406,57.547379 176.357407,38.008984 
                    C176.961823,37.959957 177.566223,37.910931 178.170624,37.861900 
                    C178.820557,39.716976 179.807831,41.526436 180.065842,43.434505 
                    C181.784439,56.144047 178.301758,68.128166 174.499969,79.997948 
                    C172.683380,85.669617 170.288712,91.156136 168.032928,97.093216 
                  z"
              />
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M235.977417,71.927284 
                    C237.971252,60.013897 238.468796,48.127415 244.816025,37.915909 
                    C245.374237,37.898682 245.932449,37.881451 246.490662,37.864220 
                    C247.097656,40.128094 247.952545,42.357761 248.270432,44.661526 
                    C250.004440,57.228107 241.777954,89.097679 233.011765,99.799934 
                    C233.989594,90.657761 234.967407,81.515587 235.977417,71.927284 
                  z"
              />
              <path
                fill="currentColor"
                opacity="1.000000"
                stroke="none"
                d="
                  M273.865601,188.808044 
                    C271.138519,194.910767 268.789459,200.786896 265.699707,206.243652 
                    C264.744965,207.929749 261.773315,208.473785 259.725128,209.540741 
                    C259.017792,207.159744 257.331879,204.580917 257.766602,202.430832 
                    C260.078308,190.996796 268.209839,183.554016 277.519592,175.108704 
                    C276.073334,180.514465 275.015808,184.467194 273.865601,188.808044 
                  z"
              />
            </svg>
          </a>
        </div>
        <div class="mx-auto">
          <div class="flex flex-row item-center justify-between w-full gap-x-4">
            <div class="flex flex-col">
              <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                {{ 'CHOOSE_RESTAURANT' | translate }}
              </h2>
              <p class="mt-2 text-lg leading-6 text-zinc-600 dark:text-zinc-400">
                {{ 'CHOOSE_RESTAURANT_DESCRIPTION' | translate }}
              </p>
            </div>
            <div class="flex flex-row items-center gap-x-2">
              <a
                class="flex flex-row items-center justify-center rounded-full p-3 w-full h-auto cursor-pointer text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                (click)="showSearch()"
              >
                <span [inlineSVG]="'magnifier.svg'" class="svg-icon svg-icon svg-icon-3 stroke-2"></span>
              </a>
              <a
                id="open-create-restaurant-panel"
                class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-full transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-[#1A1A1A] text-white bg-gradient-to-b from-black/55 via-[#1A1A1A] to-[#1A1A1A] dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/25 disabled:opacity-30"
                routerLink="/setup"
              >
                <div
                  class="flex flex-row items-center justify-center gap-x-2 bg-[#1A1A1A] p-3 rounded-[9998px] cursor-pointer"
                >
                  <span
                    class="svg-icon svg-icon-3 stroke-2 text-zinc-100 dark:text-zinc-100"
                    [inlineSVG]="'plus.svg'"
                  ></span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            class="mt-16"
            [ngClass]="{
              hidden: !isSearchVisible(),
              block: isSearchVisible()
            }"
          >
            <div class="relative mt-2 rounded-[10px] shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span
                  [inlineSVG]="'magnifier.svg'"
                  class="svg-icon svg-icon svg-icon-5 stroke-[1.4] text-zinc-400 dark:text-zinc-600"
                ></span>
              </div>
              <input
                #searchControl
                type="text"
                class="block w-full rounded-[10px] border-0 dark:bg-zinc-900 py-3.5 pl-10 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                placeholder="{{ 'SEARCH' | translate }}..."
                [formControl]="searchFormControl"
              />
            </div>
          </div>
        </div>
        @switch(store.state()) { @case('loaded') { <ng-container *ngTemplateOutlet="loaded"></ng-container> }
        @case('loading') {
        <ng-container *ngTemplateOutlet="loading"></ng-container>
        } @case('error') {
        <ng-container *ngTemplateOutlet="error"></ng-container>
        } @default {
        <ng-container *ngTemplateOutlet="empty"></ng-container>
        } }
      </div>
    </div>

    <footer class="bg-zinc-50 dark:bg-[#111]">
      <div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div class="flex justify-center space-x-6 mt-5 sm:pt-0">
          <a
            href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
            class="iubenda iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
            title="Cookie Policy"
            ><span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="cookie.svg"></span>Cookie Policy</a
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
            ><span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="lock.svg"></span>Privacy Policy</a
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
            <span class="svg-icon svg-icon-6 stroke-[1.6]" inlineSVG="circle-question.svg"></span>
            <span>{{ 'HELP' | translate }}</span>
          </a>
        </div>

        <nav class="-mb-6 mt-10 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div class="pb-6 text-center">
            <a
              (click)="userPanelUI.togglePanel()"
              class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
              >{{ 'MY_PROFILE' | translate }}</a
            >
          </div>
          <div class="pb-6 text-center">
            <a
              (click)="settingsUI.openDialog()"
              class="text-sm cursor-pointer leading-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline decoration-[1.5px]"
              >{{ 'SETTINGS' | translate }}</a
            >
          </div>
        </nav>

        <p class="mt-10 text-center text-xs leading-5 text-zinc-500">
          &copy; {{ currentYear }} Diamond Tech, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class StructuresComponent {
  @ViewChild('searchControl') searchControl!: ElementRef;

  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);
  restaurantPanelUI = inject(RestaurantPanelService);
  store = inject(StructureStore);

  searchFormControl = new FormControl('');
  isSearchVisible = signal(false);
  currentYear = moment(new Date()).year();

  constructor() {
    this.store.clear().subscribe();
    this.searchFormControl.valueChanges
      .pipe(
        untilDestroyed(this),
        map((value) => value || '')
      )
      .subscribe((value) => this.store.search$.next(value));
  }

  showSearch() {
    this.searchFormControl.reset();

    if (this.isSearchVisible()) {
      this.isSearchVisible.set(false);
      return;
    }

    this.isSearchVisible.set(true);

    setTimeout(() => {
      const inputElement = this.searchControl.nativeElement as HTMLInputElement;
      inputElement.focus();
    }, 0);
  }
}
