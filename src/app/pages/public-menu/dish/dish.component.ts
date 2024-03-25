import { Component, OnInit, input } from '@angular/core';
import { Dish } from '../../../store/public-menu/interface/public-menu';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '../../../utils/pipes/money.pipe';

@Component({
  selector: 'dish',
  standalone: true,
  imports: [CommonModule, TranslateModule, MoneyPipe],
  template: `
    <div class="group relative">
      <div
        class="h-56 sm:h-60 md:h-72 w-56 sm:w-60 md:w-72 overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800 group-hover:opacity-75 lg:h-72 xl:h-80"
      >
        @if (dish().dish.image) {
        <img [src]="dish().dish.image" alt="No Image" class="h-full w-full object-cover object-center" />
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
      <h3 class="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
        <a>
          <span class="absolute inset-0"></span>
          {{ dish().dish.name }}
        </a>
      </h3>
      <p class="mt-1 text-sm text-zinc-500 line-clamp-2">{{ dish().dish.description }}</p>
      <p class="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        <span>{{ dish().dish.price | money : currentLang() : dish().dish.currency }}</span>
      </p>
    </div>
  `,
})
export class DishComponent {
  dish = input.required<Dish>();
  currentLang = input.required<string>();
}
