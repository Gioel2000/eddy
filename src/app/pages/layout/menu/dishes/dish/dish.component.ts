import { Component, EventEmitter, Output, computed, effect, inject, input, signal } from '@angular/core';
import { CategoryTO, DishTO } from '../../../../../store/menu/interfaces/menu';
import { MoneyPipe } from '../../../../../utils/pipes/money.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'menu-dish',
  imports: [MoneyPipe, InlineSVGModule, TranslateModule],
  standalone: true,
  template: `
    <div
      class="group relative flex flex-col w-full transition ease-in-out duration-100 items-start justify-between ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl shadow-sm shadow-black/20 dark:shadow-black/40 bg-white dark:bg-[#171715] h-full max-h-[385px] pb-1"
    >
      <div class="w-full">
        <div class="h-36 sm:h-40 md:h-44 w-full overflow-hidden rounded-t-2xl p-3">
          <div class="flex flex-row w-full items-center justify-end h-0 gap-x-1 rounded-md">
            <div
              class="gap-px relative flex flex-row items-center justify-between z-10 -bottom-5 -left-1 h-8 right-0 rounded-md bg-zinc-200 dark:bg-zinc-800 shadow-md shadow-black/10 ring-1  ring-zinc-200 dark:ring-zinc-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
            >
              <a
                class="flex flex-row items-center rounded-l-md pl-2 pr-1.5 bg-white dark:bg-[#171715] hover:bg-zinc-50 dark:bg-zinc-dark h-full"
                (click)="edit.emit(dish())"
              >
                <span class="svg-icon-7 stroke-2 text-amber-500" inlineSVG="pen-2.svg"></span>
              </a>
              <a
                class="flex flex-row items-center rounded-r-md pr-2 pl-1.5 bg-white dark:bg-[#171715] hover:bg-zinc-50 dark:bg-zinc-dark h-full"
                (click)="delete.emit(dish())"
              >
                <span class="svg-icon-7 stroke-2 text-red-500" inlineSVG="trash.svg"></span>
              </a>
            </div>
          </div>
          @if (dish().image) {
          <div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg p-6">
            <span aria-hidden="true" class="absolute inset-0">
              <img [src]="dish().image" alt="" class="h-full rounded-lg w-full object-cover object-center" />
            </span>
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
        <div class="flex flex-col gap-y-1.5 px-4 pb-3">
          <h3 class="text-lg truncate font-bold text-zinc-700 dark:text-zinc-300">
            <span>{{ dish().name }}</span>
          </h3>
          <p class="text-sm text-zinc-500/80 dark:text-zinc-600 w-full line-clamp-2">
            {{ dish().description }}
          </p>
          <p class="text-base font-bold text-zinc-800 dark:text-zinc-200 drop-shadow-sm">
            {{ dish().price | money : translate.currentLang : dish().currency }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class DishComponent {
  dish = input.required<DishTO>();
  categories = input.required<CategoryTO[]>();
  translate = inject(TranslateService);

  category = signal<string>('');

  constructor() {
    combineLatest([toObservable(this.dish), toObservable(this.categories)])
      .pipe(
        untilDestroyed(this),
        filter(([dish, categories]) => !!dish && !!categories)
      )
      .subscribe(([dish, categories]) =>
        this.category.set(categories.find((c) => c._id === dish.category)?.name || '')
      );
  }

  @Output() edit = new EventEmitter<DishTO>();
  @Output() delete = new EventEmitter<DishTO>();

  peanut = computed(() => this.dish()?.allergens?.includes('peanuts'));
  milk = computed(() => this.dish()?.allergens?.includes('milk'));
  gluten = computed(() => this.dish()?.allergens?.includes('gluten'));
}
