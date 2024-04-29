import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../utils/directives/clickoutside';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewsService } from '../reviews.service';

@Component({
  selector: 'channels-dropdown',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, ClickOutsideDirective, TranslateModule, ReactiveFormsModule],
  template: ` <div
    class="sm:min-w-36 w-full border-none md:border-l border-zinc-300 dark:border-zinc-700/50"
    (clickOutside)="dropdown.close()"
  >
    <div class="relative">
      <label
        for="name"
        class="absolute -top-2 left-2 inline-block bg-white dark:bg-dark px-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >{{ 'CHANNELS' | translate }}</label
      >
      <button
        #buttonElement
        type="button"
        class="block w-full ring-1  ring-zinc-300 dark:ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
        [ngClass]="{
          'ring-2 ring-accent dark:ring-accentDark': checked(),
          'ring-1 ring-zinc-300 dark:ring-zinc-800': !checked()
        }"
        (click)="dropdown.toggle()"
      >
        <div class="flex flex-row items-center justify-between">
          <span class="truncate max-w-28 md:max-w-full xl:max-w-24 capitalize">{{
            checkedChannels() || ('NO_CHANNEL' | translate)
          }}</span>
          <span
            [inlineSVG]="'chevron-down.svg'"
            class="svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
          ></span>
        </div>
      </button>
      <div [ngClass]="{ hidden: !dropdown.isOpen() }">
        <div
          class="absolute z-10 mt-2 w-56 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-900 dark:ring-zinc-700 ring-opacity-5 focus:outline-none transition ease-out duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          [ngClass]="{
            'opacity-100 scale-100': dropdown.isVisible(),
            'opacity-0 scale-90': !dropdown.isVisible(),
            'left-0 origin-top-left ': direction() === 'left',
            'right-0 origin-top-right': direction() === 'right'
          }"
        >
          <div class="py-2 px-3" role="none">
            <fieldset>
              <div class="space-y-3">
                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsTripAdvisor()"
                    (change)="toggle('tripadvisor')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'channels/tripadvisor.svg'"
                      class="svg-icon-4 stroke-[1.8] text-emerald-600 dark:text-emerald-500"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-emerald-600 dark:text-emerald-500">{{
                      'TRIPADVISOR' | translate
                    }}</span>
                  </div>
                </div>

                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsGoogle()"
                    (change)="toggle('google')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span [inlineSVG]="'channels/google.svg'" class="svg-icon-4 stroke-[1.8] text-zinc-900"></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-zinc-900 dark:text-zinc-200">{{
                      'GOOGLE' | translate
                    }}</span>
                  </div>
                </div>

                <div class="flex flex-row items-center gap-x-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                    [checked]="thereIsTheFork()"
                    (change)="toggle('thefork')"
                  />
                  <div class="flex flex-row items-center gap-x-2">
                    <span
                      [inlineSVG]="'channels/TheFork.svg'"
                      class="svg-icon-4 stroke-[1.8] text-[#005f54] dark:text-[#00ab97]"
                    ></span>
                    <span class="block text-sm font-bold mr-2 leading-6 text-[#005f54] dark:text-[#00ab97]">{{
                      'THE_FORK' | translate
                    }}</span>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class ChannelsDropdownComponent {
  @ViewChild('buttonElement', { read: ElementRef }) buttonElement: ElementRef | undefined;

  dropdown = inject(DropdownService);
  reviews = inject(ReviewsService);

  checkedChannels = computed(() => this.reviews.filter().channels.join(', '));
  thereIsTheFork = computed(() => this.reviews.filter().channels.includes('thefork'));
  thereIsGoogle = computed(() => this.reviews.filter().channels.includes('google'));
  thereIsTripAdvisor = computed(() => this.reviews.filter().channels.includes('tripadvisor'));
  checked = computed(() => !(this.thereIsGoogle() && this.thereIsTheFork() && this.thereIsTripAdvisor()));

  direction = signal<'left' | 'right'>('left');

  constructor() {
    setTimeout(() => {
      const { innerWidth: windowWidth } = window;
      const { right } = this.buttonElement?.nativeElement.getBoundingClientRect();

      this.direction.set(right > windowWidth / 2 ? 'right' : 'left');
    }, 0);
  }

  toggle(service: string) {
    const channels = this.reviews.filter().channels;
    const thereIsService = channels.includes(service);

    if (thereIsService) {
      this.reviews.filter.set({
        ...this.reviews.filter(),
        channels: channels.filter((channel) => channel !== service),
        offset: 0,
      });
    } else {
      this.reviews.filter.set({
        ...this.reviews.filter(),
        channels: [...channels, service],
        offset: 0,
      });
    }
  }
}
