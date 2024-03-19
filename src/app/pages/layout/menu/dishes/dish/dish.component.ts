import { Component, EventEmitter, Output, effect, inject, input, signal } from '@angular/core';
import { CategoryTO, DishTO } from '../../../../../store/menu/interfaces/menu';
import { MoneyPipe } from '../../../../../utils/pipes/money.pipe';
import { TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'menu-dish',
  imports: [MoneyPipe, InlineSVGModule],
  standalone: true,
  template: `<div class="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 w-full h-full shadow-md shadow-black/5">
    @if (dish().image) {
    <div class="relative flex h-56 w-full flex-col overflow-hidden rounded-t-xl p-6">
      <span aria-hidden="true" class="absolute inset-0">
        <img [src]="dish().image" alt="" class="h-56 w-full object-cover object-center" />
      </span>
      <span
        aria-hidden="true"
        class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-50 dark:from-dark"
      ></span>
    </div>
    }

    <div class="p-4">
      <div class="flex flex-row items-center justify-between gap-x-5">
        <p class="flex items-baseline gap-x-1">
          <span class="text-xl font-bold tracking-tight text-black dark:text-white line-clamp-2">{{
            dish().name
          }}</span>
        </p>
        <p class="text-xl font-bold tracking-tight text-black dark:text-white">
          {{ dish().price | money : translate.currentLang : dish().currency }}
        </p>
      </div>
      <p class="text-sm leading-6 text-zinc-700 dark:text-zinc-300 line-clamp-1">
        {{ category() }}
      </p>
      <div class="flex flex-row items-center justify-between gap-x-5">
        <p class="text-sm leading-6 text-zinc-400 dark:text-zinc-300 line-clamp-2">
          {{ dish().description }}
        </p>
        <div class="flex flex-row items-center">
          <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
            <a
              class="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              (click)="edit.emit(dish())"
              ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="pen-2.svg"></span
            ></a>
          </div>
          <div class="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium cursor-pointer">
            <a class="text-red-600 hover:text-red-900 dark:hover:text-red-100" (click)="delete.emit(dish())"
              ><span class="svg-icon-6 stroke-[1.8]" inlineSVG="trash.svg"></span
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>`,
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
}
