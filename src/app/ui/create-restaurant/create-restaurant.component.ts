import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { LoaderComponent } from '../loader/loader.component';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import { RestaurantPanelService } from './create-restaurant.service';
import { StructureStore } from '../../store/structures/structure.service';
import { AddRestaurant } from '../../store/structures/interfaces/restaurant';
import { GoogleMapsModule } from '@angular/google-maps';

@UntilDestroy()
@Component({
  selector: 'create-restaurant-panel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    LoaderComponent,
    MomentPipe,
    ReactiveFormsModule,
    GoogleMapsModule,
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
            <div class="pointer-events-auto w-screen max-w-xl border-l border-zinc-300 dark:border-zinc-700">
              <form
                [formGroup]="formGroup"
                class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-zinc-800 shadow-xl"
              >
                <div class="flex-1">
                  <div
                    class="bg-white dark:bg-zinc-800 px-4 py-6 sm:px-6 border-b border-zinc-200 dark:border-zinc-700"
                  >
                    <div class="flex items-start justify-between space-x-3">
                      <div class="space-y-1">
                        <h2
                          class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
                          id="slide-over-title"
                        >
                          {{ 'CREATE_RESTAURANT' | translate }}
                        </h2>
                        <p class="text-sm text-zinc-500">
                          {{ 'CREATE_RESTAURANT_DESCRIPTION' | translate }}
                        </p>
                      </div>
                      <div class="flex h-7 items-center">
                        <button
                          type="button"
                          class="relative text-zinc-400 dark:text-zinc-600 hover:text-zinc-500"
                          (click)="panelUI.closePanel()"
                        >
                          <span class="svg-icon svg-icon-5" inlineSVG="xmark.svg"></span>
                        </button>
                      </div>
                    </div>
                  </div>

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
                          id="restaurant-name"
                          type="text"
                          placeholder="Da Mario"
                          formControlName="name"
                          class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
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
                          >{{ 'ADDRESS' | translate }} <span class="mx-0.4 text-red-500 font-semibold">*</span></label
                        >
                      </div>
                      <div class="col-span-2 grid grid-cols-2 sm:grid-cols-9 gap-x-2 gap-y-2 w-full">
                        <input
                          type="text"
                          placeholder="Via Torino 4"
                          formControlName="address"
                          class="sm:col-span-4 col-span-2 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        />
                        <input
                          type="text"
                          placeholder="12345"
                          formControlName="zipCode"
                          class="sm:col-span-2 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        />
                        <input
                          type="text"
                          placeholder="Roma"
                          formControlName="city"
                          class="sm:col-span-3 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
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
                            id="phone-number"
                            class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
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
                            class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-700 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                            >http://</span
                          >
                          <input
                            type="text"
                            name="company-website"
                            id="company-website"
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
                          id="restaurant-email"
                          type="text"
                          placeholder="you@example.com"
                          formControlName="email"
                          class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  @if (googleLink() === '' && formGroup.touched){
                  <div
                    class="bg-white dark:bg-zinc-800 px-4 py-6 sm:px-6 border-b border-zinc-200 dark:border-zinc-700"
                  >
                    <div class="flex items-start justify-between space-x-3">
                      <span class="text-sm text-red-500 font-semibold">{{ 'TOUCH_GOOGLE_DROPDOWN' | translate }}</span>
                    </div>
                  </div>
                  } @if (cover() !== '') {
                  <div
                    class="bg-white dark:bg-zinc-800 px-4 py-6 sm:px-6 border-b border-zinc-200 dark:border-zinc-700"
                  >
                    <div>
                      <label
                        for="project-name"
                        class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5 mb-3"
                        >{{ 'PHOTO' | translate }}</label
                      >
                    </div>
                    <div class="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                      <img [src]="cover()" alt="" class="w-full h-72 bg-zinc-100 object-cover" />
                    </div>
                  </div>
                  }
                </div>

                <div class="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-700 px-4 py-5 sm:px-6">
                  <div class="flex justify-end space-x-3">
                    @if (store.state() === 'loading'){
                    <div class="flex flex-row items-center justify-center">
                      <div class="flex flex-row items-center justify-center w-full">
                        <loader></loader>
                      </div>
                    </div>
                    }
                    <button
                      type="button"
                      class="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ease-in-out duration-200"
                      (click)="panelUI.closePanel()"
                    >
                      {{ 'CANCEL' | translate }}
                    </button>
                    <button
                      id="create-restaurant-button"
                      type="button"
                      class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg px-3 py-2 cursor-pointer ring-1 ring-inset ring-accent bg-accent dark:bg-accentDark hover:bg-accent hover:dark:bg-accentDark/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
                      (click)="add()"
                      [disabled]="formGroup.invalid || googleLink() === ''"
                    >
                      {{ 'CREATE' | translate }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateRestaurantPanelComponent implements AfterViewInit {
  @ViewChild('restaurantName', { read: ElementRef }) restaurantName: ElementRef | undefined;

  panelUI = inject(RestaurantPanelService);
  store = inject(StructureStore);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    email: new FormControl('', [Validators.email]),
  });

  googleLink = signal<string>('');
  cover = signal<string>('');
  coordinates = signal<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  constructor() {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(({ website }) => {
      if (website && (website.includes('http') || website.includes('https'))) {
        this.formGroup.patchValue({ website: website.replace('http://', '').replace('https://', '') });
      }
    });
  }

  ngAfterViewInit() {
    const htmlElement = this.restaurantName?.nativeElement as HTMLInputElement;

    const options = {
      componentRestrictions: { country: 'it' },
      fields: ['url', 'name', 'website', 'address_components', 'formatted_phone_number', 'photos', 'geometry.location'],
      strictBounds: false,
    };

    const autoComplete = new google.maps.places.Autocomplete(htmlElement, options);

    autoComplete.addListener('place_changed', (e: any) => {
      const place = autoComplete.getPlace();

      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      const address: string = place?.address_components?.find((c) => c.types.includes('route'))?.long_name || '';
      const number: string = place?.address_components?.find((c) => c.types.includes('street_number'))?.long_name || '';
      const zipCode: string = place?.address_components?.find((c) => c.types.includes('postal_code'))?.long_name || '';
      const city: string =
        place?.address_components?.find(
          (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_3')
        )?.long_name || '';
      const photo = place.photos?.[0].getUrl();

      this.cover.set(photo || '');
      this.googleLink.set(place.url || '');
      this.coordinates.set({ latitude: lat || 0, longitude: lng || 0 });

      this.formGroup.patchValue({
        name: place.name,
        address: `${address} ${number}`,
        city: city,
        zipCode: zipCode,
        telephone: place.formatted_phone_number,
        website: place.website,
      });
    });
  }

  add() {
    const { name, address, zipCode, city, telephone, website, email } = this.formGroup.value;

    this.store
      .add({
        name,
        address,
        zipCode,
        city,
        telephone,
        email: email || undefined,
        website: website || undefined,
        image: this.cover(),
        googleMapsLink: this.googleLink(),
        latitude: this.coordinates().latitude,
        longitude: this.coordinates().longitude,
      } as AddRestaurant)
      .subscribe(() => {
        this.googleLink.set('');
        this.cover.set('');
        this.panelUI.closePanel();
        this.formGroup.reset();
      });
  }
}
