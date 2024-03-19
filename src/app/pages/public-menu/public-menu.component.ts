import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, tap } from 'rxjs';
import { PublicMenuStoreService } from '../../store/public-menu/public-menu.service';
import { LoaderComponent } from '../../ui/loader/loader.component';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MoneyPipe } from '../../utils/pipes/money.pipe';

@UntilDestroy()
@Component({
  selector: 'public-menu',
  standalone: true,
  imports: [CommonModule, LoaderComponent, InlineSVGModule, TranslateModule, MoneyPipe],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-row items-center justify-center w-full h-screen">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6 lg:py-8 py-5">
      @switch(publicMenu.state()) { @case('loaded') {
      <div class="h-full lg:pr-10 lg:pl-3 px-4">
        <h1 class="block text-xl font-medium text-zinc-900">
          {{ publicMenu.menu().name }}
        </h1>
        <div class="mx-auto bg-zinc-50">
          <div class="block">
            <nav class="flex border-b border-zinc-200 pb-6"></nav>
          </div>
        </div>

        @for (category of publicMenu.menu().categories; track $index) {
        <div class="py-16">
          <div class="md:flex md:items-center md:justify-between">
            <h2 class="text-lg font-bold tracking-tight text-zinc-700">{{ category.category.name }}</h2>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            @for (dish of dishesFromCategory(category.category._id); track $index) {
            <div class="group relative">
              <div class="h-56 w-full overflow-hidden rounded-md bg-zinc-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                @if (dish.dish.image) {
                <img [src]="dish.dish.image" alt="No Image" class="h-full w-full object-cover object-center" />
                } @else {
                <div class="flex flex-col items-center justify-center gap-y-2 h-full w-full object-cover object-center">
                  <span class="text-zinc-900 svg-icon-1 stroke-[1.6]">
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
                  <span class="text-zinc-900 font-semibold">
                    {{ 'NO_IMAGE' | translate }}
                  </span>
                </div>
                }
              </div>
              <h3 class="mt-4 text-sm text-zinc-700">
                <a>
                  <span class="absolute inset-0"></span>
                  {{ dish.dish.name }}
                </a>
              </h3>
              <p class="mt-1 text-sm text-zinc-500">{{ dish.dish.description }}</p>
              <p class="mt-1 text-sm font-medium text-zinc-900">
                <span>{{ dish.dish.price | money : translate.currentLang : dish.dish.currency }}</span>
              </p>
            </div>
            }
          </div>
        </div>
        }
      </div>

      } @case('loading') {
      <ng-container *ngTemplateOutlet="loading"></ng-container>
      } @case('error') {
      <ng-container *ngTemplateOutlet="error"></ng-container>
      } @default {
      <ng-container *ngTemplateOutlet="empty"></ng-container>
      } }
    </div>
  `,
})
export class PublicMenuComponent {
  route = inject(ActivatedRoute);
  publicMenu = inject(PublicMenuStoreService);
  translate = inject(TranslateService);

  invalidId = signal(false);

  constructor() {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        map((paramMap: ParamMap) => paramMap.get('id')),
        tap((id) => this.invalidId.set(!id)),
        filter((id): id is string => !!id)
      )
      .subscribe((id) => this.publicMenu.menuId$.next(id));

    effect(() => {
      console.log(this.publicMenu.menu());
    });
  }

  dishesFromCategory(category: string) {
    return this.publicMenu.menu().dishes.filter((dish) => dish.dish.category === category);
  }
}
