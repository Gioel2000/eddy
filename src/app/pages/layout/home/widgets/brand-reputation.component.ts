import { Component, computed, inject } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import { GrowthPercentagePipe } from '../../../../utils/pipes/growthPercentage.pipe';
import moment from 'moment';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';

@Component({
  selector: 'brand-reputation-graph',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    InlineSVGModule,
    TranslateModule,
    NgxChartsModule,
    NumberPipe,
    GrowthPercentagePipe,
    MissingTranslationPipe,
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[485px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div
        id="error-view"
        class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[485px]"
      >
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div #container class="flex flex-col border-b border-zinc-200 dark:border-zinc-800 py-6">
      @switch (brandReputation().state) { @case ('loaded') {
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <dt class="text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
          {{ 'BRAND_REPUTATION' | translate }}
        </dt>
        <div class="flex flex-row items-center gap-x-3 w-full">
          <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-900 dark:text-zinc-100">
            {{ brandReputation().data.average | numb : translate.currentLang : 2 }}
            <span class="text-sm font-semibold text-zinc-400 dark:text-zinc-600"> / 5 </span>
          </dd>
          <dd
            class="flex flex-row items-center text-sm font-semibold tracking-tight leading-9 px-2 rounded-md gap-x-1"
            [ngClass]="{
              'text-green-600 bg-green-100 dark:bg-green-900': isBRPositive() === '+',
              'text-red-600 bg-red-100 dark:bg-red-900': isBRPositive() === '-',
              'text-zinc-500 bg-zinc-100 dark:bg-zinc-900': isBRPositive() === '=',
            }"
          >
            @if (isBRPositive() === '+') {
            <span [inlineSVG]="'arrow-up.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (isBRPositive() === '-') {
            <span [inlineSVG]="'arrow-down.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (isBRPositive() === '=') {
            <span [inlineSVG]="'priority-normal.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            }
            <span> {{ growthPercentage() | numb : translate.currentLang }}% </span>
          </dd>
        </div>
        <dt class="text-sm font-medium leading-6 text-zinc-500">
          vs. {{ averageGraph() | numb : translate.currentLang : 2 }}
          {{ 'AVERAGE_OF_THE_PERIOD' | translate | lowercase }}
        </dt>
      </div>
      <div class="mt-8 -mx-4">
        <ngx-charts-line-chart
          [view]="[container.offsetWidth + 30, 280]"
          [results]="data()"
          [xAxis]="true"
          [yAxis]="true"
          [showXAxisLabel]="false"
          [showYAxisLabel]="false"
          [showGridLines]="true"
          [animations]="true"
          [autoScale]="true"
          [roundDomains]="true"
          [scheme]="{
            name: 'accent',
            selectable: true,
            group: linear,
            domain: isBRPositive() === '+' ? ['#22c55e'] : (isBRPositive() === '-' ? ['#ef4444'] : ['#71717a']),
          }"
          style="fill: #71717a;"
        >
        </ngx-charts-line-chart>
      </div>
      } @case ('error') {
      <ng-container [ngTemplateOutlet]="error"></ng-container>
      } @case ('empty') {
      <ng-container [ngTemplateOutlet]="empty"></ng-container>
      } @case ('loading') {
      <ng-container [ngTemplateOutlet]="loading"></ng-container>
      } }
    </div>
  `,
})
export class BrandReputationComponent {
  store = inject(DashboardStore);
  translate = inject(TranslateService);
  linear = ScaleType.Linear;

  brandReputation = computed(() => this.store.brandReputation());

  averageGraph = computed(() => {
    const data = this.brandReputation()?.data?.graph || [];
    return data.reduce((acc, { average }) => acc + average, 0) / data.length;
  });

  isBRPositive = computed(() => {
    const average = +(this.brandReputation()?.data?.average || 0);
    const averageGraph = +this.averageGraph();

    return average > averageGraph ? '+' : average < averageGraph ? '-' : '=';
  });

  growthPercentage = computed(() => {
    const average = +(this.brandReputation()?.data?.average || 0);
    const averageGraph = +this.averageGraph();
    const growth = ((average - averageGraph) / average) * 100;

    return growth;
  });

  data = computed(() => {
    const data = this.brandReputation()?.data?.graph || [];
    const { currentLang } = this.translate;

    const brandReputation = this.translate.instant('BRAND_REPUTATION');

    const { startdate, enddate } = this.store.filter();

    const dataFilled = this.fillWithMissingDays(data, startdate, enddate);

    return [
      {
        name: brandReputation,
        series: dataFilled.map(({ date, average: value }) => ({
          name: moment(date).locale(currentLang).format('DD/MM'),
          value,
        })),
      },
    ];
  });

  private fillWithMissingDays(data: { date: string; average: number }[], startdate: Date, enddate: Date) {
    const momentStartdate = moment(startdate);
    const momentEnddate = moment(enddate);

    let now = momentStartdate.clone();

    const ratings: { date: Date; average: number }[] = [];

    while (now.isSameOrBefore(momentEnddate)) {
      ratings.push({
        date: now.toDate(),
        average:
          data.find((rating) => now.isSame(rating.date, 'day'))?.average || ratings[ratings.length - 1]?.average || 0,
      });

      now = momentStartdate.clone();
      momentStartdate.add(1, 'day');
    }

    const ratingsFormatted = ratings.filter(({ average }) => average > 0);

    return ratingsFormatted;
  }
}
