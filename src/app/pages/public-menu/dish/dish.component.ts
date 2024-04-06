import { Component, EventEmitter, Output, computed, effect, input } from '@angular/core';
import { Dish } from '../../../store/public-menu/interface/public-menu';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '../../../utils/pipes/money.pipe';

@Component({
  selector: 'dish',
  standalone: true,
  imports: [CommonModule, TranslateModule, MoneyPipe],
  template: `
    <a
      class="group relative flex flex-col transition ease-in-out duration-100 items-start justify-between ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-xl shadow-sm shadow-black/20 hover:shadow-md bg-zinc-100 dark:bg-zinc-900 h-full"
      (click)="open.emit(dish())"
    >
      <div>
        <div
          class="h-44 sm:h-52 md:h-60 w-56 sm:w-60 md:w-72 overflow-hidden rounded-t-xl bg-zinc-200 dark:bg-zinc-900 group-hover:opacity-75"
        >
          @if (dish().dish.image) {
          <div class="relative flex h-full w-full flex-col overflow-hidden rounded-t-xl p-6">
            <span aria-hidden="true" class="absolute inset-0">
              <img [src]="dish().dish.image" alt="" class="h-full w-full object-cover object-center" />
            </span>
            <span
              aria-hidden="true"
              class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-100 dark:from-zinc-900"
            ></span>
          </div>
          } @else {
          <div class="flex flex-col items-center justify-center gap-y-2 h-full w-full object-cover object-center">
            <span class="text-zinc-900 dark:text-zinc-100 svg-icon-1 stroke-[1.6]">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                <title>image sparkle 3</title>
                <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                  <path
                    d="M4,14.75l5.836-5.836c.781-.781,2.047-.781,2.828,0l3.586,3.586"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M16.25,8.5v4.25c0,1.105-.895,2-2,2H3.75c-1.105,0-2-.895-2-2V5.25c0-1.105,.895-2,2-2h5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <circle cx="5.75" cy="7.25" r="1.25" fill="currentColor" stroke="none"></circle>
                  <polygon
                    points="14.25 .75 15.1 2.9 17.25 3.75 15.1 4.6 14.25 6.75 13.4 4.6 11.25 3.75 13.4 2.9 14.25 .75"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></polygon>
                </g>
              </svg>
            </span>
            <span class="text-zinc-900 dark:text-zinc-100 font-semibold">
              {{ 'NO_IMAGE' | translate }}
            </span>
          </div>
          }
        </div>
        <div class="px-4 pb-4 mb-1.5">
          <h3 class="mt-4 w-44 sm:w-52 md:w-56 truncate text-base font-bold text-zinc-700 dark:text-zinc-300">
            <span class="absolute inset-0"></span>
            <span>{{ dish().dish.name }}</span>
          </h3>
          <p class="text-xl font-bold text-zinc-800 dark:text-zinc-200 drop-shadow-sm">
            {{ dish().dish.price | money : currentLang() : dish().dish.currency }}
          </p>
          <p class="mt-1 text-sm text-zinc-400 dark:text-zinc-600 w-48 sm:w-52 md:w-60 line-clamp-2">
            {{ dish().dish.description }}
          </p>
        </div>
      </div>
    </a>
  `,
})
export class DishComponent {
  dish = input.required<Dish>();
  currentLang = input.required<string>();

  @Output() open = new EventEmitter<Dish>();
}
