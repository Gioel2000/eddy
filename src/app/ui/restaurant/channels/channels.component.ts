import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../../../store/structures/structure.service';
import { RestaurantSettedTO } from '../../../store/structures/interfaces/restaurant';
import { LoaderComponent } from '../../loader/loader.component';
import { RestaurantPanelService } from '../panel.service';

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-channels',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ReactiveFormsModule, LoaderComponent, InlineSVGModule],
  template: `
    <form [formGroup]="formGroup" class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-zinc-800">
      <div class="flex-1">
        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div class="col-span-full sm:col-span-1">
              <div
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full ring-1 ring-inset ring-zinc-200 dark:ring-zinc-600 shadow-sm bg-zinc-50 dark:bg-zinc-700"
              >
                <span
                  [inlineSVG]="'channels/tripadvisor.svg'"
                  class="svg-icon svg-icon-2 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                ></span>
                <span class="block text-sm font-bold mr-0.5 leading-6 text-emerald-600 dark:text-emerald-500">{{
                  'TRIPADVISOR' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('tripadvisor')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  id="restaurant-channels-tripadvisor"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.thefork.it/ristorante/diamonds-r732559"
                  formControlName="tripadvisor"
                />
              </div>
              <button
                type="button"
                id="delete-tripadvisor-button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('tripadvisor')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div class="col-span-full sm:col-span-1">
              <div
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full ring-1 ring-inset ring-zinc-200 dark:ring-zinc-600 shadow-sm bg-zinc-50 dark:bg-zinc-700"
              >
                <span
                  [inlineSVG]="'channels/google.svg'"
                  class="svg-icon svg-icon-4 stroke-[1.8] text-zinc-900 dark:text-zinc-100"
                ></span>
                <span class="block text-sm font-bold mr-0.5 leading-6 text-zinc-900 dark:text-zinc-300">{{
                  'GOOGLE' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('google')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  id="restaurant-channels-google"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.google.com/travel/hotels/entity/aje4nbsk"
                  formControlName="google"
                />
              </div>
              <button
                type="button"
                id="delete-google-button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('google')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div class="col-span-full sm:col-span-1">
              <div
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full ring-1 ring-inset ring-zinc-200 dark:ring-zinc-600 shadow-sm bg-zinc-50 dark:bg-zinc-700"
              >
                <span
                  [inlineSVG]="'channels/TheFork.svg'"
                  class="svg-icon svg-icon-4 stroke-[1.8] text-[#005f54] dark:text-[#00ab97]"
                ></span>
                <span class="block text-sm font-bold mr-0.5 leading-6 text-[#005f54] dark:text-[#00ab97]">{{
                  'THE_FORK' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('thefork')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  id="restaurant-channels-thefork"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.thefork.it/ristorante/diamonds-r732559"
                  formControlName="thefork"
                />
              </div>
              <button
                type="button"
                id="delete-thefork-button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('thefork')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
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
            <div id="channels-restaurant-success-alert" class="flex flex-row items-center justify-center">
              <div class="flex flex-row items-center justify-center w-full">
                <span [inlineSVG]="'check.svg'" class="svg-icon svg-icon-3 text-green-600 stroke-[1.6]"></span>
              </div>
            </div>
            } @if (structures.errors()){
            <div class="flex flex-row items-center justify-center">
              <div class="flex flex-row items-center justify-center w-full">
                <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-3 text-red-500 stroke-[1.6]"></span>
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
              id="delete-restaurant-button"
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-red-600 dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-sm shadow-black/30"
              (click)="save()"
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
      </div>
    </form>
  `,
})
export class ChannelsRestaurantPanelComponent {
  panelUI = inject(RestaurantPanelService);
  structures = inject(StructureStore);
  changeDetectionRef = inject(ChangeDetectorRef);

  formGroup = new FormGroup({
    tripadvisor: new FormControl(''),
    google: new FormControl(''),
    thefork: new FormControl(''),
  });

  constructor() {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(({ thefork, tripadvisor, google }) => {
      if (thefork && thefork.includes('http')) {
        const newWebsite = thefork.replaceAll('https://', '').replaceAll('http://', '');
        this.formGroup.patchValue({ thefork: newWebsite }, { emitEvent: false });
      }

      if (tripadvisor && tripadvisor.includes('http')) {
        const newWebsite = tripadvisor.replaceAll('https://', '').replaceAll('http://', '');
        this.formGroup.patchValue({ tripadvisor: newWebsite }, { emitEvent: false });
      }

      if (google && google.includes('http')) {
        const newWebsite = google.replaceAll('https://', '').replaceAll('http://', '');
        this.formGroup.patchValue({ google: newWebsite }, { emitEvent: false });
      }
    });

    toObservable(this.structures.selected)
      .pipe(
        untilDestroyed(this),
        filter((restaurant): restaurant is RestaurantSettedTO => !!restaurant),
        map((restaurant) => restaurant.channels)
      )
      .subscribe((channels) => {
        this.formGroup.patchValue({
          thefork: '',
          google: '',
          tripadvisor: '',
        });

        this.formGroup.get('thefork')?.enable();
        this.formGroup.get('google')?.enable();
        this.formGroup.get('tripadvisor')?.enable();

        const thefork = channels.find((channel) => channel.source.toLowerCase() === 'thefork');
        const google = channels.find((channel) => channel.source.toLowerCase() === 'google');
        const tripadvisor = channels.find((channel) => channel.source.toLowerCase() === 'tripadvisor');

        if (thefork && thefork.url) {
          this.formGroup.patchValue({ thefork: thefork.url });
          this.formGroup.get('thefork')?.disable();
          this.formGroup.get('thefork')?.markAsPristine();
          this.changeDetectionRef.detectChanges();
        }

        if (google && google.url) {
          this.formGroup.patchValue({ google: google.url });
          this.formGroup.get('google')?.disable();
          this.formGroup.get('thefork')?.markAsPristine();
          this.changeDetectionRef.detectChanges();
        }

        if (tripadvisor && tripadvisor.url) {
          this.formGroup.patchValue({ tripadvisor: tripadvisor.url });
          this.formGroup.get('tripadvisor')?.disable();
          this.formGroup.get('thefork')?.markAsPristine();
          this.changeDetectionRef.detectChanges();
        }
      });
  }

  save() {
    const structure = this.structures.selected()?.channels || [];

    const tripadvisorId = structure.find((channel) => channel?.source?.toLowerCase() === 'tripadvisor')?._id || '';
    const theforkId = structure.find((channel) => channel?.source?.toLowerCase() === 'thefork')?._id || '';
    const googleId = structure.find((channel) => channel?.source?.toLowerCase() === 'google')?._id || '';

    const thefork = this.formGroup.get('thefork')?.value || '';
    const google = this.formGroup.get('google')?.value || '';
    const tripadvisor = this.formGroup.get('tripadvisor')?.value || '';

    const channels: { source: string; url: string; id: string }[] = [];

    if (thefork) {
      channels.push({ source: 'thefork', url: `https://${thefork}`, id: theforkId });
      this.formGroup.get('thefork')?.disable();
    }

    if (google) {
      channels.push({ source: 'google', url: `https://${google}`, id: googleId });
      this.formGroup.get('google')?.disable();
    }

    if (tripadvisor) {
      channels.push({ source: 'tripadvisor', url: `https://${tripadvisor}`, id: tripadvisorId });
      this.formGroup.get('tripadvisor')?.disable();
    }

    this.structures.saveChannels(channels);
  }

  delete(channel: 'thefork' | 'google' | 'tripadvisor') {
    if (!this.formGroup.get(channel)?.disabled) return;

    this.panelUI.isAllowed.set(false);
    setTimeout(() => this.panelUI.isAllowed.set(true), 0);

    this.formGroup.patchValue({ [channel]: '' });

    if (!this.formGroup.get('thefork')?.value) this.formGroup.get('thefork')?.enable();
    if (!this.formGroup.get('google')?.value) this.formGroup.get('google')?.enable();
    if (!this.formGroup.get('tripadvisor')?.value) this.formGroup.get('tripadvisor')?.enable();

    const id = this.structures.selected()?.channels.find((c) => c.source.toLowerCase() === channel)?._id || '';

    this.structures.deleteChannel(id);
  }
}
