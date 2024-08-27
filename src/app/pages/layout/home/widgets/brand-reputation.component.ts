import { Component, computed, inject, signal } from '@angular/core';
import { DashboardStore } from '../../../../store/dashboard/dashboard.service';
import { LoaderComponent } from '../../../../ui/loader/loader.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { NumberPipe } from '../../../../utils/pipes/number.pipe';
import moment from 'moment';
import { MissingTranslationPipe } from '../../../../utils/pipes/missingTranslation.pipe';
import { GrowthPipe } from '../../../../utils/pipes/growth.pipe';

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
    MissingTranslationPipe,
    GrowthPipe,
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
              'text-green-600 bg-green-100 dark:bg-green-900': growth() > 0,
              'text-red-600 bg-red-100 dark:bg-red-900': growth() < 0,
              'text-zinc-500 bg-zinc-100 dark:bg-zinc-900': growth() === 0,
            }"
          >
            @if (growth() > 0) {
            <span [inlineSVG]="'arrow-up.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (growth() < 0) {
            <span [inlineSVG]="'arrow-down.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            } @if (growth() === 0) {
            <span [inlineSVG]="'priority-normal.svg'" class="svg-icon svg-icon-7 stroke-2"></span>
            }
            <span> {{ growth() | growth : translate.currentLang : 4 }} </span>
          </dd>
        </div>
        <dt class="text-sm font-medium leading-6 text-zinc-500">
          <div class="flex flex-row relative whitespace-nowrap mt-1">
            <svg class="fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <g>
                <path
                  d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                ></path>
              </g>
            </svg>
            <svg class="fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <g>
                <path
                  d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                ></path>
              </g>
            </svg>
            <svg class="fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <g>
                <path
                  d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                ></path>
              </g>
            </svg>
            <svg class="fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <g>
                <path
                  d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                ></path>
              </g>
            </svg>
            <svg class="fill-yellow-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <g>
                <path
                  d="M16.963,6.786c-.088-.271-.323-.469-.605-.51l-4.62-.671L9.672,1.418c-.252-.512-1.093-.512-1.345,0l-2.066,4.186-4.62,.671c-.282,.041-.517,.239-.605,.51-.088,.271-.015,.57,.19,.769l3.343,3.258-.79,4.601c-.048,.282,.067,.566,.298,.734,.231,.167,.538,.189,.79,.057l4.132-2.173,4.132,2.173c.11,.058,.229,.086,.349,.086,.155,0,.31-.048,.441-.143,.231-.168,.347-.452,.298-.734l-.79-4.601,3.343-3.258c.205-.199,.278-.498,.19-.769Z"
                ></path>
              </g>
            </svg>

            <div
              class="bg-white/50 dark:bg-dark/80 mix-blend-darker h-full overflow-hidden absolute top-0 right-0"
              [style.width.%]="(5 - brandReputation().data.average) * 20"
            ></div>
          </div>
        </dt>
      </div>
      <div class="mt-8 -mx-4">
        <ngx-charts-line-chart
          [view]="[container.offsetWidth + 30, 340]"
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
            domain: growth() > 0 ? ['#22c55e'] : growth() < 0 ? ['#ef4444'] : ['#71717a']
          }"
          [xAxisTickFormatting]="xAxisTickFormatting"
          class="fill-zinc-500"
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

  startDate = computed(() => this.store.filter().startdate);
  endDate = computed(() => this.store.filter().enddate);

  datesToShow = computed(() => {
    const startdate = this.startDate();
    const enddate = this.endDate();
    const dates = [];

    let index = 0;
    let now = moment(startdate).clone();

    while (now.isSameOrBefore(moment(enddate))) {
      dates.push(now.toDate());
      now = moment(startdate).clone().add(index++, 'day');
    }

    return dates;
  });

  brandReputation = computed(() => this.store.brandReputation());

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
          name: moment(date).locale(currentLang).toDate(),
          value,
        })),
      },
    ];
  });

  growth = computed(() => {
    const data = this.brandReputation()?.data?.graph || [];
    const { startdate, enddate } = this.store.filter();
    const dataFilled = this.fillWithMissingDays(data, startdate, enddate);

    const firstValue = dataFilled[0]?.average || 0;
    const lastValue = dataFilled[dataFilled.length - 1]?.average || 0;

    return lastValue - firstValue;
  });

  xAxisTickFormatting = (date: Date) => {
    const datesToShow = this.datesToShow();

    const momentDate = moment(date);
    const momentDatesToShow = datesToShow.map((date) => moment(date));

    if (momentDatesToShow.some((date) => date.isSame(momentDate, 'day'))) {
      return momentDate.format('DD/MM');
    }

    return '';
  };

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
