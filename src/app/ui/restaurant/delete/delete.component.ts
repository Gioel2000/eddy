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
        class="rounded-lg bg-yellow-50 dark:bg-yellow-500/10 ring-1 ring-inset ring-yellow-300 dark:ring-yellow-500 p-4 shadow-sm shadow-yellow-500/30"
      >
        <div class="flex">
          <div class="flex-shrink-0 mt-0.5">
            <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon-3 text-yellow-500 stroke-[1.4]"></span>
          </div>
          <div class="ml-3">
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
          class="flex flex-row items-center justify-center col-span-1 rounded-lg gap-x-1 py-2.5 px-4 cursor-pointer ring-1 ring-inset ring-red-600 bg-red-500 hover:bg-red-600/90 text-white shadow-[shadow:inset_0_2.3px_theme(colors.white/40%)] disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
          (click)="onDelete()"
        >
          <span [inlineSVG]="'trash.svg'" class="svg-icon-5 stroke-[1.7]"></span>
          <span class="font-semibold text-base">{{ 'DELETE' | translate }}</span>
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
