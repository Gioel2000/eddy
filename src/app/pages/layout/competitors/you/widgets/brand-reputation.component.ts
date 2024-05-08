import { Component, computed, inject } from '@angular/core';
import { DashboardStore } from '../../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import moment from 'moment';
import { NumberPipe } from '../../../../../utils/pipes/number.pipe';
import { GrowthPercentagePipe } from '../../../../../utils/pipes/growthPercentage.pipe';
import { CompetitorsService } from '../../competitors.service';

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
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[385px]">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[385px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-[385px]">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #loaded>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <dt class="text-sm font-medium leading-6 text-zinc-200">
          {{ 'BRAND_REPUTATION' | translate }}
        </dt>
        <div class="flex flex-row items-center gap-x-3 w-full">
          <dd class="flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-100">
            {{ competitor.you.brandReputation().data.average | numb : translate.currentLang : 1 }}
            <span class="text-sm font-semibold text-zinc-600"> / 5 </span>
          </dd>
          <dd
            class="flex flex-row items-center text-sm font-semibold tracking-tight leading-9 px-2 rounded-md gap-x-1"
            [ngClass]="{
              'text-green-600 bg-green-900': isBRPositive() === '+',
              'text-red-600 bg-red-900': isBRPositive() === '-',
              'text-zinc-500 bg-zinc-900': isBRPositive() === '=',
            }"
          >
            @if (isBRPositive() === '+') {
            <span [inlineSVG]="'arrow-up.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (isBRPositive() === '-') {
            <span [inlineSVG]="'arrow-down.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (isBRPositive() === '=') {
            <span [inlineSVG]="'priority-normal.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            }
            <span> {{ growthPercentage() | numb : translate.currentLang : 2 }}% </span>
          </dd>
        </div>
        <dt class="text-sm font-medium leading-6 text-zinc-500">
          vs. {{ averageGraph() | numb : translate.currentLang : 2 }}
          {{ 'AVERAGE_OF_THE_PERIOD' | translate | lowercase }}
        </dt>
      </div>
      <div class="mt-8 -mx-4">
        <ngx-charts-line-chart
          [view]="[container.offsetWidth + 30, 180]"
          [results]="data()"
          [xAxis]="true"
          [yAxis]="false"
          [showXAxisLabel]="false"
          [showYAxisLabel]="true"
          [showGridLines]="true"
          [animations]="true"
          [autoScale]="true"
          [roundDomains]="true"
          [scheme]="{
            name: 'accent',
            selectable: true,
            group: linear,
            domain: isBRPositive() ? ['#22c55e', '#facc15', '#8b5cf6'] : ['#ef4444', '#facc15', '#8b5cf6'],
          }"
          style="fill: #71717a;"
        >
        </ngx-charts-line-chart>
      </div>
    </ng-template>

    <div #container class="flex flex-col border-b border-zinc-800 py-6">
      @switch (competitor.you.brandReputation().state) { @case ('loaded') {
      <ng-container [ngTemplateOutlet]="loaded"></ng-container>
      } @case('error') {
      <ng-container [ngTemplateOutlet]="error"></ng-container>
      } @case ('empty') {
      <ng-container [ngTemplateOutlet]="loaded"></ng-container>
      } @case ('loading') {
      <ng-container [ngTemplateOutlet]="loading"></ng-container>
      } }
    </div>
  `,
})
export class BrandReputationComponent {
  translate = inject(TranslateService);
  competitor = inject(CompetitorsService);
  linear = ScaleType.Linear;

  averageGraph = computed(() => {
    const data = this.competitor.you.brandReputation().data?.graph || [];
    return data.reduce((acc, { average }) => acc + average, 0) / data.length;
  });

  isBRPositive = computed(() => {
    const average = this.competitor.you.brandReputation().data?.average || 0;
    const averageGraph = this.averageGraph();

    return averageGraph > average ? '+' : averageGraph < average ? '-' : '=';
  });

  growthPercentage = computed(() => {
    const average = this.competitor.you.brandReputation().data?.average || 0;
    const averageGraph = this.averageGraph();
    const growth = ((averageGraph - average) / average) * 100;

    return growth;
  });

  data = computed(() => {
    const average = this.competitor.you.brandReputation().data?.average || 0;
    const data = this.competitor.you.brandReputation().data?.graph || [];
    const { currentLang } = this.translate;

    const brandReputationOverTime = this.translate.instant('BRAND_REPUTATION_OVER_TIME');
    const brandReputationCurrent = this.translate.instant('BRAND_REPUTATION_CURRENT');
    const competition = this.translate.instant('COMPETITION');
    const averageBrandReputation =
      this.competitor.others
        .competitors()
        .map((competitor) => competitor?.reputation?.average || 0)
        .reduce((acc, value) => acc + value, 0) / this.competitor.others.competitors().length;

    return [
      {
        name: brandReputationOverTime,
        series: data.map(({ date, average: value }) => ({
          name: moment(date).locale(currentLang).format('DD/MM'),
          value,
        })),
      },
      {
        name: brandReputationCurrent,
        series: data.map(({ date, average: value }) => ({
          name: moment(date).locale(currentLang).format('DD/MM'),
          value: average,
        })),
      },
      {
        name: competition,
        series: data.map(({ date }) => ({
          name: moment(date).locale(currentLang).format('DD/MM'),
          value: averageBrandReputation,
        })),
      },
    ];
  });
}
