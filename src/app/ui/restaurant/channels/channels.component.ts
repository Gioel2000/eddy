import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full bg-zinc-50 dark:bg-zinc-800 shadow-sm shadow-black/10 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600"
              >
                <span
                  [inlineSVG]="'channels/tripadvisor.svg'"
                  class="svg-icon-2 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                ></span>
                <span class="block text-sm font-bold mr-2 leading-6 text-emerald-600 dark:text-emerald-500">{{
                  'TRIPADVISOR' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-700 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('tripadvisor')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.thefork.it/ristorante/diamonds-r732559"
                  formControlName="tripadvisor"
                />
              </div>
              @if (formGroup.get('tripadvisor')?.disabled) {
              <button
                type="button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('tripadvisor')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
              }
            </div>
          </div>
        </div>

        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div class="col-span-full sm:col-span-1">
              <div
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full bg-zinc-50 dark:bg-zinc-800 shadow-sm shadow-black/10 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600"
              >
                <span [inlineSVG]="'channels/google.svg'" class="svg-icon-2 stroke-[1.8] text-zinc-900"></span>
                <span class="block text-sm font-bold mr-2 leading-6 text-zinc-900 dark:text-zinc-200">{{
                  'GOOGLE' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-700 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('google')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.google.com/travel/hotels/entity/aje4nbsk"
                  formControlName="google"
                />
              </div>
              @if (formGroup.get('google')?.disabled) {
              <button
                type="button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('google')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
              }
            </div>
          </div>
        </div>

        <div>
          <div
            class="grid grid-cols-3 gap-1 sm:gap-4 space-y-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-700"
          >
            <div class="col-span-full sm:col-span-1">
              <div
                class="flex flex-row items-center justify-center w-fit gap-x-2 p-3 rounded-full bg-zinc-50 dark:bg-zinc-800 shadow-sm shadow-black/10 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600"
              >
                <span
                  [inlineSVG]="'channels/TheFork.svg'"
                  class="svg-icon-2 text-[#005f54] dark:text-[#00ab97] stroke-[1.8]"
                ></span>
                <span class="block text-sm font-bold mr-2 leading-6 text-[#005f54] dark:text-[#00ab97]">{{
                  'THE_FORK' | translate
                }}</span>
              </div>
            </div>
            <div class="col-span-full sm:col-span-2 flex flex-row items-center gap-x-2">
              <div class="flex rounded-md shadow-sm w-full">
                <span
                  class="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-700 px-3 text-zinc-400 dark:text-zinc-600 text-sm"
                  [ngClass]="{ 'opacity-30': formGroup.get('thefork')?.disabled }"
                  >http://</span
                >
                <input
                  type="text"
                  class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 bg-white dark:bg-zinc-800 py-1.5 text-zinc-900 dark:text-zinc-100 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm sm:leading-6 disabled:opacity-30 disabled:text-opacity-30"
                  placeholder="www.thefork.it/ristorante/diamonds-r732559"
                  formControlName="thefork"
                />
              </div>
              @if (formGroup.get('thefork')?.disabled) {
              <button
                type="button"
                class="flex fle-row items-center rounded-md px-2.5 py-2 cursor-pointer text-sm font-semibold hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                (click)="delete('thefork')"
              >
                <span inlineSVG="trash.svg" class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"></span>
              </button>
              }
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
              class="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ease-in-out duration-200"
              (click)="panelUI.closePanel()"
            >
              {{ 'CANCEL' | translate }}
            </button>
            <button
              class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg px-3 py-2 cursor-pointer ring-1 ring-inset ring-accent bg-accent dark:bg-accentDark hover:bg-accent hover:dark:bg-accentDark/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
              [disabled]="formGroup.invalid || formGroup.pristine"
              (click)="save()"
            >
              {{ 'EDIT' | translate }}
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
        }

        if (google && google.url) {
          this.formGroup.patchValue({ google: google.url });
          this.formGroup.get('google')?.disable();
        }

        if (tripadvisor && tripadvisor.url) {
          this.formGroup.patchValue({ tripadvisor: tripadvisor.url });
          this.formGroup.get('tripadvisor')?.disable();
        }
      });
  }

  save() {
    const tripadvisorId =
      this.structures.selected()?.channels.find((channel) => channel.source.toLowerCase() === 'tripadvisor')?._id || '';

    const theforkId =
      this.structures.selected()?.channels.find((channel) => channel.source.toLowerCase() === 'thefork')?._id || '';

    const googleId =
      this.structures.selected()?.channels.find((channel) => channel.source.toLowerCase() === 'google')?._id || '';

    const channels = [
      { source: 'thefork', url: this.formGroup.get('thefork')?.value || '', id: theforkId },
      { source: 'google', url: this.formGroup.get('google')?.value || '', id: googleId },
      { source: 'tripadvisor', url: this.formGroup.get('tripadvisor')?.value || '', id: tripadvisorId },
    ].filter((channel) => channel.url);

    if (this.formGroup.get('thefork')?.value) this.formGroup.get('thefork')?.disable();
    if (this.formGroup.get('google')?.value) this.formGroup.get('google')?.disable();
    if (this.formGroup.get('tripadvisor')?.value) this.formGroup.get('tripadvisor')?.disable();

    this.structures.saveChannels(channels);
  }

  delete(channel: 'thefork' | 'google' | 'tripadvisor') {
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
