import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddCompetitorDialogService } from '../add-competitor-dialog.service';
import { SelectService } from './select.service';
import { WorldComponent } from '../../world/world.component';
import { MissingTranslationPipe } from '../../../utils/pipes/missingTranslation.pipe';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';
import { CompetitorsStore } from '../../../store/competitors/competitors.service';
import { SettingsService } from '../../settings/settings.service';
import { UserPanelService } from '../../user/user.service';
import { AddCompetitor } from '../../../store/setup/interfaces/competitors';
import moment from 'moment';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'step1-competitor-dialog',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    WorldComponent,
    MissingTranslationPipe,
    ClickOutsideDirective,
  ],
  standalone: true,
  template: `
    <ng-template #loading>
      <div class="col-span-1 px-6 pb-24 pt-8 sm:pt-24 sm:pb-32 lg:px-8">
        <div class="flex flex-col items-center">
          <world
            [title]="'DO_NOT_CLOSE' | translate"
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

    <ng-template #loaded>
      <form [formGroup]="formGroup" class="pt-8">
        <div class="grid grid-cols-2 gap-x-8 gap-y-7">
          <div class="col-span-2">
            <label for="first-name" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              >{{ 'NAME' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
            >
            <div class="mt-2.5">
              <input
                #restaurantName
                id="restaurant-name"
                type="text"
                placeholder="Eddy's Pizzeria"
                formControlName="name"
                name="first-name"
                id="first-name"
                autocomplete="given-name"
                class="block w-full rounded-md border-0 px-3.5 dark:bg-transparent py-2 text-zinc-900 dark:text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accentDark text-sm leading-6"
              />
            </div>
          </div>
          <div class="col-span-2" [ngClass]="{ 'opacity-30 cursor-none pointer-events-none': googleLink() === '' }">
            <label for="email" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100 "
              >{{ 'ADDRESS' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
            >
            <div class="mt-2.5">
              <div class="col-span-2 grid grid-cols-2 sm:grid-cols-9 gap-x-3 gap-y-2 w-full">
                <input
                  type="text"
                  placeholder="Via Torino 4"
                  formControlName="address"
                  class="sm:col-span-4 col-span-2 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-transparent shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                />
                <input
                  type="text"
                  placeholder="12345"
                  formControlName="zipCode"
                  class="sm:col-span-2 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-transparent shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                />
                <input
                  type="text"
                  placeholder="Roma"
                  formControlName="city"
                  class="sm:col-span-3 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-transparent shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                />
              </div>
            </div>
          </div>
          <div class="col-span-1" [ngClass]="{ 'opacity-30 cursor-none pointer-events-none': googleLink() === '' }">
            <label for="phone-number" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              >{{ 'TYPOLOGY' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
            >
            <div class="mt-2.5">
              <div class="relative rounded-md shadow-sm">
                <button
                  type="button"
                  class="relative w-full cursor-default rounded-md bg-white dark:bg-transparent px-3.5 py-2 pr-10 text-left text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accentDark text-sm sm:leading-6"
                  aria-haspopup="listbox"
                  aria-expanded="true"
                  aria-labelledby="listbox-label"
                  (clickOutside)="select.close()"
                  (click)="select.toggle()"
                >
                  <span class="block truncate capitalize">
                    {{ structureTypes[selectedType()] | uppercase | translate }}
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
                    class="absolute z-10 mt-2 w-full rounded-md bg-white dark:bg-transparent shadow-md shadow-black/20 ring-1 ring-zinc-300 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 animate-blurToClear200  left-0 origin-top"
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
                      (click)="selectedType.set($index)"
                    >
                      <span class="block text-sm truncate font-medium capitalize">{{
                        option | uppercase | translate
                      }}</span>

                      @if (selectedType() === $index) {
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
          <div class="col-span-1" [ngClass]="{ 'opacity-30 cursor-none pointer-events-none': googleLink() === '' }">
            <label for="message" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              >{{ 'TELEPHONE' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
            >
            <div class="mt-2.5">
              <input
                type="text"
                name="phone-number"
                id="phone-number"
                class="block w-full rounded-md border-0 px-3.5 dark:bg-transparent py-2 text-zinc-900 dark:text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accentDark text-sm leading-6"
                placeholder="111 111 1111"
                formControlName="telephone"
              />
            </div>
          </div>
          <div
            class="col-span-2 sm:col-span-1"
            [ngClass]="{ 'opacity-30 cursor-none pointer-events-none': googleLink() === '' }"
          >
            <label for="message" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{{
              'WEBSITE' | translate
            }}</label>
            <div class="mt-2.5">
              <div class="flex rounded-md shadow-sm">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-700 py-2 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  >http://</span
                >
                <input
                  type="text"
                  name="company-website"
                  id="company-website"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-transparent py-2 text-zinc-900 dark:text-zinc-300 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
                  placeholder="www.example.com"
                  formControlName="website"
                />
              </div>
            </div>
          </div>
          <div
            class="col-span-2 sm:col-span-1"
            [ngClass]="{ 'opacity-30 cursor-none pointer-events-none': googleLink() === '' }"
          >
            <label for="message" class="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{{
              'EMAIL' | translate
            }}</label>
            <div class="mt-2.5">
              <input
                id="restaurant-email"
                type="text"
                placeholder="you@example.com"
                formControlName="email"
                class="block w-full rounded-md border-0 py-2 text-zinc-900 dark:text-zinc-300 bg-white dark:bg-transparent shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
            </div>
          </div>
        </div>
        @if (photos().length > 0){
        <div class="flex flex-col gap-y-2 space-y-0 px-px pt-5">
          <div class="flex flex-row items-center justify-between">
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
                <span class="svg-icon svg-icon-7 stroke-[1.3]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>arrow left</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="2.75"
                        y1="9"
                        x2="15.25"
                        y2="9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="currentColor"
                      ></line>
                      <polyline
                        points="7 13.25 2.75 9 7 4.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                    </g>
                  </svg>
                </span>
              </a>
              <a
                class="flex flex-row items-center justify-center bg-transparent rounded-full p-1.5 shadow-sm hover:bg-black/5 dark:hover:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-400 dark:text-zinc-600"
                (click)="goRight()"
              >
                <span class="svg-icon svg-icon-7 stroke-[1.3]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>arrow right</title>
                    <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="15.25"
                        y1="9"
                        x2="2.75"
                        y2="9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="currentColor"
                      ></line>
                      <polyline
                        points="11 4.75 15.25 9 11 13.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></polyline>
                    </g>
                  </svg>
                </span>
              </a>
            </div>
          </div>
          <div
            #photosContainer
            class="flex flex-row items-start gap-x-1 mt-10 pb-4 overflow-x-auto w-full sm:max-w-[33rem]"
          >
            @for (photo of photos(); track $index) {
            <div class="flex flex-col items-start m-1">
              <a
                class="relative flex flex-col items-start w-44 rounded-lg border border-white dark:border-zinc-800 bg-white hover:ring-4 hover:ring-accent dark:hover:ring-accentDark hover:shadow-md hover:shadow-accent/70 dark:hover:shadow-accentDark/70 cursor-pointer transition ease-in-out duration-100 animate-blurToClear100  focus:outline-none"
                [ngClass]="{
                          'ring-4 ring-accent dark:ring-accentDark shadow-md shadow-accent/70 dark:shadow-accentDark/70': selectedPhoto() === $index,
                        }"
                (click)="selectedPhoto.set($index)"
              >
                <img
                  [src]="photo.preview"
                  alt=""
                  class="rounded-[7px] h-44 w-full bg-zinc-100 object-center object-cover"
                />
                <div class="w-44"></div>
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
              class="relative flex flex-col items-start w-full rounded-lg border border-white dark:border-zinc-800 bg-transparent cursor-pointer transition focus:outline-none m-1"
            >
              <div class="w-44"></div>
              <a
                class="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-900/25 dark:border-zinc-100/25 h-44 min-w-44 w-full"
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
        }

        <div
          class="flex justify-end"
          [ngClass]="{
            'opacity-30 cursor-none pointer-events-none': formGroup.invalid || googleLink() === ''
          }"
        >
          <button
            id="edit-restaurant-button"
            class="col-start-1 mt-6 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[8px] w-full h-full transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-red-600 dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-md shadow-black/20"
            (click)="add()"
          >
            <div
              class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 rounded-[7px] cursor-pointer"
            >
              <span class="font-semibold text-base"> {{ 'CREATE' | translate }}</span>
            </div>
          </button>
        </div>
      </form>
    </ng-template>

    @switch (store.state()) { @case ('loading') {
    <ng-container *ngTemplateOutlet="loading"></ng-container>
    } @case ('error') {
    <ng-container *ngTemplateOutlet="error"></ng-container>
    } @case ('loaded') {
    <ng-container *ngTemplateOutlet="loaded"></ng-container>
    } }
  `,
})
export class Step1CompetitorDialog {
  @ViewChild('restaurantName', { read: ElementRef }) restaurantName: ElementRef | undefined;
  @ViewChild('photosContainer', { read: ElementRef }) photosContainer: ElementRef | undefined;
  @ViewChild('fileUpload', { read: ElementRef }) fileUpload: ElementRef | undefined;

  readonly ALLOWED_TYPES = ['image'];
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  dialog = inject(AddCompetitorDialogService);
  store = inject(CompetitorsStore);
  select = inject(SelectService);
  settingsUI = inject(SettingsService);
  userPanelUI = inject(UserPanelService);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    email: new FormControl('', [Validators.email]),
  });

  readonly structureTypes = ['restaurant', 'pizzeria', 'bar', 'pub'];
  photos = signal<
    {
      preview: string;
      file?: File;
      type?: string;
    }[]
  >([]);
  googleLink = signal<string>('');
  selectedPhoto = signal<number>(0);
  selectedType = signal<number>(0);
  googlePlaceId = signal<string>('');
  coordinates = signal<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  readonly currentYear = moment(new Date()).year();

  constructor() {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(({ website }) => {
      if (website && (website.includes('http') || website.includes('https'))) {
        this.formGroup.patchValue({ website: website.replace('http://', '').replace('https://', '') });
      }
    });

    toObservable(this.dialog.isDialogOpen)
      .pipe(
        untilDestroyed(this),
        filter((isOpen) => isOpen),
        first()
      )
      .subscribe(() => {
        const htmlElement = this.restaurantName?.nativeElement as HTMLInputElement;
        const options = {
          // componentRestrictions: { country: 'it' },
          fields: [
            'url',
            'name',
            'website',
            'address_components',
            'formatted_phone_number',
            'photos',
            'geometry.location',
            'place_id',
          ],
          strictBounds: false,
        };

        const autoComplete = new google.maps.places.Autocomplete(htmlElement, options);

        autoComplete.addListener('place_changed', (e: any) => {
          const place = autoComplete.getPlace();

          const lat = place.geometry?.location?.lat() || 0;
          const lng = place.geometry?.location?.lng() || 0;

          const address: string =
            place?.address_components?.find((c) => c.types.includes('route') || c.types.includes('sublocality_level_2'))
              ?.long_name || '';
          const number: string =
            place?.address_components?.find((c) => c.types.includes('street_number'))?.long_name || '';
          const zipCode: string =
            place?.address_components?.find((c) => c.types.includes('postal_code'))?.long_name || '';
          const city: string =
            place?.address_components?.find(
              (c) =>
                c.types.includes('locality') ||
                c.types.includes('administrative_area_level_3') ||
                c.types.includes('postal_town')
            )?.long_name || '';

          const photos = place.photos?.map((p: any) => p.getUrl()) || ([] as string[]);
          const googlePlaceId = place.place_id || '';

          this.photos.set(photos.map((photo) => ({ preview: photo })));
          this.selectedPhoto.set(0);
          this.googleLink.set(place.url || '');
          this.googlePlaceId.set(googlePlaceId);
          this.coordinates.set({ latitude: lat, longitude: lng });

          this.formGroup.patchValue({
            name: place.name,
            address: `${address} ${number}`,
            city: city,
            zipCode: zipCode,
            telephone: place.formatted_phone_number,
            website: place.website,
          });
        });
      });
  }

  add() {
    const { name, address, zipCode, city, telephone, website, email } = this.formGroup.value;
    const { file, preview } = this.photos()[this.selectedPhoto()];

    this.store.add({
      name,
      address,
      zipCode,
      city,
      telephone,
      email,
      website,
      image: file ?? preview,
      type: this.structureTypes[this.selectedType()],
      googleMapsLink: this.googleLink(),
      googlePlaceId: this.googlePlaceId(),
      latitude: this.coordinates().latitude,
      longitude: this.coordinates().longitude,
    } as AddCompetitor);
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
  }

  getUrl(googlephoto: { height: number; html_attributions: string[]; photo_reference: string; width: number }) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${googlephoto.width}&photoreference=${googlephoto.photo_reference}&key=AIzaSyAHZLeQ42t5INTGE4OKGUNmWpvjHqFGR6M`;
  }
}
