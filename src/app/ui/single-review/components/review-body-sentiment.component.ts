import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FilterArrayPipe } from '../../../utils/pipes/filterArray.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@UntilDestroy()
@Component({
  selector: 'body-review-sentiment',
  standalone: true,
  imports: [CommonModule, FilterArrayPipe, TranslateModule, InlineSVGModule],
  template: `
    <div class="grid grid-cols-3">
      <ng-container *ngIf="categories | filterArray : 'valutation' : 'positive' as positive">
        <ng-container *ngIf="positive && positive.length">
          <div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
            <label class="flex flex-row text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200 mb-2"
              >{{ 'SPEAK_WELL_OF' | translate }}
            </label>
            <span
              *ngFor="let sentiment of positive"
              class="inline-flex items-center rounded-md dark:bg-green-400/10 px-2 py-1 text-xs font-medium dark:text-green-400 ring-1  dark:ring-green-400/20 bg-green-200/70 text-green-700 ring-green-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-green-400/20 hover:bg-green-100/50"
            >
              {{ sentiment.name }}
            </span>
          </div>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="categories | filterArray : 'valutation' : 'negative' as negative">
        <ng-container *ngIf="negative && negative.length">
          <div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
            <label class="flex flex-row text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200 mb-2"
              >{{ 'SPEAK_BADLY_OF' | translate }}
            </label>
            <span
              *ngFor="let sentiment of negative"
              class="inline-flex items-center rounded-md dark:bg-red-400/10 px-2 py-1 text-xs font-medium dark:text-red-400 ring-1  dark:ring-red-400/20 bg-red-200/70 text-red-700 ring-red-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-red-400/20 hover:bg-red-100/50"
            >
              {{ sentiment.name }}
            </span>
          </div>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="categories | filterArray : 'valutation' : 'neutral' as neutral">
        <ng-container *ngIf="neutral && neutral.length">
          <div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
            <label class="flex flex-row text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200 mb-2"
              >{{ 'ALSO_TALK_ABOUT' | translate }}
            </label>
            <span
              *ngFor="let sentiment of neutral"
              class="inline-flex items-center rounded-md dark:bg-yellow-400/10 px-2 py-1 text-xs font-medium dark:text-yellow-400 ring-1  dark:ring-yellow-400/20 bg-yellow-200/70 text-yellow-700 ring-yellow-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-yellow-400/20 hover:bg-yellow-100/50"
            >
              {{ sentiment.name }}
            </span>
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyReviewSentimentComponent {
  @Input() country: string | null = null;
  @Input() categories: {
    name: string;
    score: number;
    valutation: string;
    category: string;
  }[] = [];
}
