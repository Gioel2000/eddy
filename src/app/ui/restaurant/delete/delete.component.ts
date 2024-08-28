import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LoaderComponent } from '../../loader/loader.component';
import { StructureStore } from '../../../store/structures/structure.service';
import { RestaurantPanelService } from '../panel.service';

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-delete',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ReactiveFormsModule, LoaderComponent, InlineSVGModule],
  template: `
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="rounded-lg bg-yellow-50 dark:bg-yellow-500/10 ring-1 ring-inset ring-yellow-300 dark:ring-yellow-500 p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-3 text-yellow-500 stroke-[1.4]"></span>
          </div>
          <div class="ml-2">
            <h3 class="text-sm font-medium text-yellow-500">{{ 'IRREVERSIBLE' | translate }}</h3>
            <div class="my-1 text-xs text-yellow-500/80">
              <p>
                {{ 'DELETE_RESTAURANT_WARNING' | translate }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <button
          id="delete-restaurant-button"
          class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] h-full transition ease-in-out duration-200 animate-blurToClear200  opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-red-600 dark:ring-red-500 text-white bg-gradient-to-b from-red-600/55 dark:from-red-500/55 via-red-600 dark:via-red-500 to-red-600 dark:to-red-500 p-px shadow-md shadow-black/30"
          (click)="onDelete()"
        >
          <div
            class="flex flex-row items-center justify-center gap-x-2 bg-red-600 dark:bg-red-500 h-full px-3 py-2 rounded-[9px] cursor-pointer"
          >
            <span [inlineSVG]="'trash.svg'" class="svg-icon svg-icon-5 stroke-[1.7]"></span>
            <span class="font-semibold text-base">{{ 'DELETE' | translate }}</span>
          </div>
        </button>
      </div>
    </div>
  `,
})
export class DeleteRestaurantPanelComponent {
  structures = inject(StructureStore);
  panelUI = inject(RestaurantPanelService);

  onDelete() {
    this.structures.delete();
    this.panelUI.closePanel();
  }
}
