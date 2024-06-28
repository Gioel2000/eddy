import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, single, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../../../store/structures/structure.service';
import { EditRestaurant, RestaurantSettedTO } from '../../../store/structures/interfaces/restaurant';
import { LoaderComponent } from '../../loader/loader.component';
import { RestaurantPanelService } from '../panel.service';
import { SelectService } from './select.service';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-edit',
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
    <form [formGroup]="formGroup" class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-zinc-800">
      <div class="flex-1">
        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'NAME' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
              >
            </div>
            <div class="col-span-2">
              <input
                #restaurantName
                id="restaurant-edit-name"
                type="text"
                placeholder="Da Mario"
                formControlName="name"
                class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'TYPOLOGY' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
              >
            </div>
            <div class="col-span-2">
              <div class="relative rounded-md shadow-sm">
                <button
                  type="button"
                  class="relative w-full cursor-default rounded-md bg-transparent py-1.5 pl-3 pr-10 text-left text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark sm:text-sm sm:leading-6"
                  aria-haspopup="listbox"
                  aria-expanded="true"
                  aria-labelledby="listbox-label"
                  (clickOutside)="select.close()"
                  (click)="select.toggle()"
                >
                  <span class="block truncate capitalize">
                    {{ structureTypes[this.formGroup.value.selectedType!] | uppercase | translate }}
                  </span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      class="h-5 w-5 text-zinc-400 dark:text-zinc-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                <div [ngClass]="{ hidden: !select.isOpen() }">
                  <ul
                    class="absolute z-10 mt-2 w-full rounded-md bg-white dark:bg-zinc-800 shadow-md shadow-black/10 ring-1 ring-zinc-300 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 left-0 origin-top"
                    tabindex="-1"
                    role="listbox"
                    aria-labelledby="listbox-label"
                    aria-activedescendant="listbox-option-3"
                    [ngClass]="{
                      'opacity-100 scale-100': select.isVisible(),
                      'opacity-0 scale-90': !select.isVisible()
                    }"
                  >
                    @for (option of structureTypes; track $index) {
                    <li
                      class="relative cursor-default select-none py-2 pl-3 pr-9 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      id="listbox-option-0"
                      role="option"
                      [ngClass]="{
                        'rounded-t-lg': $index === 0,
                        'rounded-b-lg': $index === structureTypes.length - 1
                      }"
                      (click)="setType($index)"
                    >
                      <span class="block text-sm truncate font-medium capitalize">{{
                        option | uppercase | translate
                      }}</span>

                      @if (this.formGroup.value.selectedType! === $index) {
                      <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-accent dark:text-accentDark">
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                      }
                    </li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'ADDRESS' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
              >
            </div>
            <div class="col-span-2 grid grid-cols-2 sm:grid-cols-9 gap-x-2 gap-y-2 w-full">
              <input
                type="text"
                id="restaurant-edit-address"
                placeholder="Via Torino 4"
                formControlName="address"
                class="sm:col-span-4 col-span-2 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
              <input
                type="text"
                id="restaurant-edit-zip-code"
                placeholder="12345"
                formControlName="zipCode"
                class="sm:col-span-2 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
              <input
                type="text"
                id="restaurant-edit-city"
                placeholder="Roma"
                formControlName="city"
                class="sm:col-span-3 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
            </div>
          </div>

          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'TELEPHONE' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
              >
            </div>
            <div class="col-span-2">
              <div class="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="phone-number"
                  id="restaurant-edit-phone-number"
                  class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
                  placeholder="111 111 1111"
                  formControlName="telephone"
                />
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'WEBSITE' | translate }}</label
              >
            </div>
            <div class="col-span-2">
              <div class="flex rounded-md shadow-sm">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  >http://</span
                >
                <input
                  type="text"
                  name="company-website"
                  id="restaurant-edit-website"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
                  placeholder="www.example.com"
                  formControlName="website"
                />
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'EMAIL' | translate }}</label
              >
            </div>
            <div class="col-span-2">
              <input
                type="text"
                id="restaurant-edit-email"
                placeholder="you@example.com"
                formControlName="email"
                class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
            </div>
          </div>
          @if (photos().length > 0) {
          <div class="flex flex-col gap-y-2 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700 w-full">
            <div class="flex flex-row items-center justify-between w-full">
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'CHOOSE_PHOTO' | translate }}</label
              >
              <div class="flex flex-row items-center gap-x-1">
                <a
                  class="flex flex-row items-center justify-center bg-transparent rounded-full p-1.5 shadow-sm hover:bg-black/5 dark:hover:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-400 dark:text-zinc-600"
                  (click)="goLeft()"
                >
                  <span [inlineSVG]="'arrow-left.svg'" class="svg-icon svg-icon-7 stroke-[1.3]"></span>
                </a>
                <a
                  class="flex flex-row items-center justify-center bg-transparent rounded-full p-1.5 shadow-sm hover:bg-black/5 dark:hover:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-400 dark:text-zinc-600"
                  (click)="goRight()"
                >
                  <span [inlineSVG]="'arrow-right.svg'" class="svg-icon svg-icon-7 stroke-[1.3]"></span>
                </a>
              </div>
            </div>
            <div class="mt-10 w-full" [style.width.px]="dragAndDropWidth()">
              <div #photosContainer class="flex flex-row items-start gap-x-1 overflow-x-auto">
                @for (photo of photos(); track $index) {
                <div class="flex flex-col items-start m-1">
                  <a
                    class="relative flex flex-col items-start w-36 rounded-lg border border-white dark:border-zinc-800 bg-white hover:ring-4 hover:ring-accent dark:hover:ring-accentDark hover:shadow-md hover:shadow-accent/70 dark:hover:shadow-accentDark/70 cursor-pointer transition ease-in-out duration-100 focus:outline-none"
                    [ngClass]="{
                      'ring-4 ring-accent dark:ring-accentDark shadow-md shadow-accent/70 dark:shadow-accentDark/70': selectedPhoto() === $index,
                    }"
                    (click)="selectedPhoto.set($index); formGroup.markAsDirty()"
                  >
                    <img
                      [src]="photo.preview"
                      alt=""
                      class="rounded-[7px] h-36 w-full bg-zinc-100 object-center object-cover"
                    />
                  </a>
                  @if (photo.file){
                  <button
                    type="button"
                    class="mt-2 text-sm font-semibold text-red-500 hover:underline decoration-2"
                    (click)="removeFile($index)"
                  >
                    {{ 'REMOVE' | translate }}
                  </button>
                  }
                </div>
                }

                <a
                  class="relative flex flex-col items-start w-full rounded-lg border border-white dark:border-zinc-800 bg-transparent cursor-pointer transition focus:outline-none"
                >
                  <div class="w-36"></div>
                  <a
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-900/25 dark:border-zinc-100/25 h-36 min-w-36 w-full my-1"
                    (dragover)="onDragOver($event)"
                    (drop)="onDropSuccess($event)"
                    (click)="clickFileUpload()"
                  >
                    <div class="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="mt-3 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        <h1
                          class="relative cursor-pointer rounded-md font-semibold text-accent dark:text-accentDark focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:text-accent hover:dark:text-accentDark/70"
                        >
                          {{ 'UPLOAD_IMAGE' | translate }}
                          <input #fileUpload type="file" class="sr-only" (change)="onImagesPicked($event)" />
                        </h1>
                      </div>
                      <p class="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                        {{ 'UPLOAD_MAX_LIMIT' | translate }}
                      </p>
                    </div>
                  </a>
                </a>
              </div>
            </div>
          </div>
          } @else {
          <div class="flex flex-col gap-y-2 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700 w-full">
            <div class="flex flex-row items-center justify-between w-full">
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'CHOOSE_PHOTO' | translate }}</label
              >
              <a
                class="flex flex-row items-center justify-center cursor-pointer gap-x-1 text-sm font-medium bg-transparent rounded-lg py-2 px-2 shadow-sm hover:bg-black/5 dark:hover:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-600 dark:text-zinc-400"
                (click)="loadImagesFromGoogle()"
              >
                <span [inlineSVG]="'channels/google.svg'" class="svg-icon svg-icon-4 stroke-[1.8] text-zinc-900"></span>
                {{ 'LOAD_IMAGES_FROM_GOOGLE' | translate }}
              </a>
            </div>
            <div class="mt-10 w-full">
              <div class="flex flex-row items-start gap-x-1 overflow-x-auto">
                <a
                  #dragAndDrop
                  class="relative flex flex-col items-start w-full rounded-lg border border-white dark:border-zinc-800 bg-transparent cursor-pointer transition focus:outline-none"
                >
                  <div class="w-36"></div>
                  <a
                    class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-900/25 dark:border-zinc-100/25 h-36 min-w-36 w-full my-1"
                    (dragover)="onDragOver($event)"
                    (drop)="onDropSuccess($event)"
                    (click)="clickFileUpload()"
                  >
                    <div class="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="mt-3 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        <h1
                          class="relative cursor-pointer rounded-md font-semibold text-accent dark:text-accentDark focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:text-accent hover:dark:text-accentDark/70"
                        >
                          {{ 'UPLOAD_IMAGE' | translate }}
                          <input #fileUpload type="file" class="sr-only" (change)="onImagesPicked($event)" />
                        </h1>
                      </div>
                      <p class="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                        {{ 'UPLOAD_MAX_LIMIT' | translate }}
                      </p>
                    </div>
                  </a>
                </a>
              </div>
            </div>
          </div>
          }
        </div>
      </div>

      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-end space-x-3">
          @if (structures.state() === 'loading'){
          <div class="flex flex-row items-center justify-center">
            <div class="flex flex-row items-center justify-center w-full">
              <loader></loader>
            </div>
          </div>
          } @if (structures.savedSuccesfully()){
          <div id="edit-restaurant-success-alert" class="flex flex-row items-center justify-center">
            <div class="flex flex-row items-center justify-center w-full">
              <span [inlineSVG]="'check.svg'" class="svg-icon svg-icon-3 text-green-600 stroke-[1.6]"></span>
            </div>
          </div>
          }
          <button
            type="button"
            class="rounded-[9px] bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ease-in-out duration-200"
            (click)="panelUI.closePanel()"
          >
            {{ 'CANCEL' | translate }}
          </button>
          <button
            id="edit-restaurant-button"
            class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-red-600 dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-sm shadow-black/30 disabled:opacity-30"
            (click)="edit()"
            [disabled]="formGroup.invalid || formGroup.pristine"
          >
            <div
              class="flex flex-row items-center justify-center gap-x-2 bg-red-600 dark:bg-red-500 h-full px-3 py-2 rounded-[9px] cursor-pointer"
            >
              <span class="font-semibold text-base"> {{ 'EDIT' | translate }}</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  `,
})
export class EditRestaurantPanelComponent {
  @ViewChild('photosContainer', { read: ElementRef }) photosContainer: ElementRef | undefined;
  @ViewChild('fileUpload', { read: ElementRef }) fileUpload: ElementRef | undefined;
  @ViewChild('dragAndDrop', { read: ElementRef }) dragAndDropElement: ElementRef | undefined;

  panelUI = inject(RestaurantPanelService);
  structures = inject(StructureStore);
  select = inject(SelectService);
  detectorRef = inject(ChangeDetectorRef);

  readonly ALLOWED_TYPES = ['image'];
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  readonly structureTypes = ['restaurant', 'pizzeria', 'bar', 'pub'];

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    selectedType: new FormControl(0, [Validators.required]),
  });
  dragAndDropWidth = signal<number>(0);
  photos = signal<
    {
      preview: string;
      file?: File;
      type?: string;
    }[]
  >([]);
  selectedPhoto = signal<number>(0);

  constructor() {
    toObservable(this.structures.selected)
      .pipe(
        untilDestroyed(this),
        filter((restaurant): restaurant is RestaurantSettedTO => !!restaurant),
        map((restaurant) => ({
          ...restaurant,
          selectedType: this.structureTypes.indexOf(restaurant.type),
        }))
      )
      .subscribe((structure) => {
        this.formGroup.patchValue(structure);
        this.detectorRef.detectChanges();
      });

    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(({ website }) => {
      if (website && website.includes('http')) {
        const newWebsite = website.replaceAll('https://', '').replaceAll('http://', '');
        this.formGroup.patchValue({ website: newWebsite }, { emitEvent: false });
      }
    });
  }

  ngAfterViewInit() {
    this.dragAndDropWidth.set(this.dragAndDropElement?.nativeElement.offsetWidth);
  }

  setType(index: number) {
    this.formGroup.markAsDirty();
    this.formGroup.patchValue({
      selectedType: index,
    });
  }

  loadImagesFromGoogle() {
    const htmlElement: HTMLInputElement = document.createElement('input');
    const { googlePlaceId } = this.structures.selected() || {};

    new google.maps.places.PlacesService(htmlElement).getDetails({ placeId: googlePlaceId }, (place) => {
      const photos = place?.photos?.map((p: any) => p.getUrl()) || ([] as string[]);
      this.photos.set(photos.map((photo) => ({ preview: photo })));

      if (photos) {
        this.selectedPhoto.set(0);
        this.formGroup.markAsDirty();
      }
    });
  }

  goLeft() {
    const photosContainer = this.photosContainer?.nativeElement as HTMLElement;
    photosContainer.scrollTo({
      left: photosContainer.scrollLeft - 200,
      behavior: 'smooth',
    });
  }

  goRight() {
    const photosContainer = this.photosContainer?.nativeElement as HTMLElement;
    photosContainer.scrollTo({
      left: photosContainer.scrollLeft + 200,
      behavior: 'smooth',
    });
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();
    this.onFileChange(event.dataTransfer.files);
  }

  onImagesPicked(fileInput: any) {
    const [file] = fileInput.target.files;
    this.uploadFile(file);
  }

  removeFile(index: number) {
    this.photos.set(this.photos().filter((_, i) => i !== index));
    this.selectedPhoto.set(this.photos().length - 1);
  }

  clickFileUpload() {
    const fileUpload = this.fileUpload?.nativeElement as HTMLElement;
    fileUpload.click();
  }

  private onFileChange(fileInput: File[]) {
    const file = fileInput[0];
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    if (file && this.checkIfFileIsAllowed(file) && this.checkIfFileSizeIsAllowed(file)) {
      this.renderFile(file, file.type);
    }
  }

  private checkIfFileIsAllowed(file: File) {
    const fileExtension = file.type.split('/')[0];
    return this.ALLOWED_TYPES.includes(fileExtension);
  }

  private checkIfFileSizeIsAllowed(file: File) {
    return file.size <= this.MAX_FILE_SIZE;
  }

  private renderFile(file: File | string | null, fileType: string) {
    if (!file || !fileType) return;

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const photo = reader.result as string;
        this.photos.set([...this.photos(), { preview: photo, file, type: fileType }]);
        this.selectedPhoto.set(this.photos().length - 1);
      };
    }

    if (typeof file === 'string') {
      this.photos.set([...this.photos(), { preview: file }]);
    }

    this.formGroup.markAsDirty();
  }

  edit() {
    this.panelUI.isAllowed.set(false);
    setTimeout(() => this.panelUI.isAllowed.set(true), 0);

    const selected = this.structures.selected();
    const { file, preview } = this.photos()[this.selectedPhoto()] || {};

    if (!selected) return;

    const { _id: id } = selected;
    const { name, address, zipCode, city, telephone, email, website } = this.formGroup.value;
    const selectedType = this.structureTypes[this.formGroup.value.selectedType || 0];
    const restaurant = {
      name,
      address,
      zipCode,
      city,
      telephone,
      email: email || undefined,
      website: website || undefined,
      type: selectedType,
      image: file ?? preview,
    };

    this.structures.edit({ id, restaurant } as EditRestaurant);
  }
}
