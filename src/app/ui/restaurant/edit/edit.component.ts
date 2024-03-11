import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../../../store/structures/structure.service';
import { EditRestaurant, RestaurantSettedTO } from '../../../store/structures/interfaces/restaurant';
import { LoaderComponent } from '../../loader/loader.component';
import { RestaurantPanelService } from '../panel.service';

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-edit',
  standalone: true,
  template: `
    <form [formGroup]="formGroup" class="flex h-full flex-col overflow-y-scroll bg-zinc-50 dark:bg-zinc-800">
      <div class="flex-1">
        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <label
                for="project-name"
                class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100 mt-1.5"
                >{{ 'NAME' | translate }}</label
              >
            </div>
            <div class="col-span-2">
              <input
                #restaurantName
                type="text"
                placeholder="Da Mario"
                formControlName="name"
                class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
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
                >{{ 'ADDRESS' | translate }}</label
              >
            </div>
            <div class="col-span-2 grid grid-cols-2 sm:grid-cols-9 gap-x-2 gap-y-2 w-full">
              <input
                type="text"
                placeholder="Via Torino 4"
                formControlName="address"
                class="sm:col-span-4 col-span-2 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
              <input
                type="text"
                placeholder="12345"
                formControlName="zipCode"
                class="sm:col-span-2 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
              />
              <input
                type="text"
                placeholder="Roma"
                formControlName="city"
                class="sm:col-span-3 col-span-1 block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
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
                >{{ 'EMAIL' | translate }}</label
              >
            </div>
            <div class="col-span-2">
              <input
                type="text"
                placeholder="you@example.com"
                formControlName="email"
                class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
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
                >{{ 'TELEPHONE' | translate }}</label
              >
            </div>
            <div class="col-span-2">
              <div class="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  class="block w-full rounded-md border-0 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
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
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-zinc-50 dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6"
                  placeholder="www.example.com"
                  formControlName="website"
                />
              </div>
            </div>
          </div>
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
          <div class="flex flex-row items-center justify-center">
            <div class="flex flex-row items-center justify-center w-full">
              <span [inlineSVG]="'check.svg'" class="svg-icon-3 text-green-600 stroke-[1.6]"></span>
            </div>
          </div>
          }
          <button
            type="button"
            class="rounded-md bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ease-in-out duration-200"
            (click)="panelUI.closePanel()"
          >
            {{ 'CANCEL' | translate }}
          </button>
          <button
            class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg px-3 py-2 cursor-pointer ring-1 ring-inset ring-accent bg-accent hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
            (click)="edit()"
            [disabled]="formGroup.invalid || formGroup.pristine"
          >
            {{ 'EDIT' | translate }}
          </button>
        </div>
      </div>
    </form>
  `,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ReactiveFormsModule, LoaderComponent],
})
export class EditRestaurantPanelComponent {
  panelUI = inject(RestaurantPanelService);
  structures = inject(StructureStore);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    website: new FormControl(''),
  });

  constructor() {
    toObservable(this.structures.selected)
      .pipe(
        untilDestroyed(this),
        filter((restaurant): restaurant is RestaurantSettedTO => !!restaurant)
      )
      .subscribe((structure) => this.formGroup.patchValue(structure));

    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(({ website }) => {
      if (website && website.includes('http')) {
        const newWebsite = website.replaceAll('https://', '').replaceAll('http://', '');
        this.formGroup.patchValue({ website: newWebsite }, { emitEvent: false });
      }
    });
  }

  edit() {
    this.panelUI.isAllowed.set(false);
    setTimeout(() => this.panelUI.isAllowed.set(true), 0);

    const selected = this.structures.selected();

    if (!selected) return;

    const { _id: id } = selected;
    const restaurant = this.formGroup.value;

    this.structures.edit({ id, restaurant } as EditRestaurant);
  }
}
