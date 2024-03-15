import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DatePickerComponent } from '../../../ui/datepicker/datepicker.component';
import { ChannelsDropdownComponent } from './channels/channels.component';
import { CompetitorsService } from './competitors.service';
import moment from 'moment';
import { YouComponent } from './you/you.component';
import { CompetitorComponent } from './competitor/competitor.component';

@Component({
  selector: 'competitors',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ReactiveFormsModule,
    DatePickerComponent,
    ChannelsDropdownComponent,
    YouComponent,
    CompetitorComponent,
  ],
  template: `
    <div class="h-full lg:pr-10 lg:pl-3 px-4">
      <h1 class="hidden sm:block text-xl font-medium text-zinc-900 dark:text-zinc-100">
        {{ 'COMPETITORS' | translate }}
      </h1>
      <div class="mx-auto bg-zinc-50 dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-10 pb-6">
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
            >
              <div class="grid gap-4 sm:grid-cols-3 w-full sm:w-auto sm:max-w-full gap-y-6">
                <date-picker
                  class="col-span-1"
                  [i18n]="'STARTDATE'"
                  [date]="startdate()"
                  [limitStart]="limitStart"
                  [limitEnd]="enddate()"
                  (onDateSet)="setStartDate($event)"
                ></date-picker>
                <date-picker
                  class="col-span-1"
                  [i18n]="'ENDDATE'"
                  [date]="enddate()"
                  [limitStart]="startdate()"
                  [limitEnd]="now"
                  (onDateSet)="setEndDate($event)"
                ></date-picker>
                <channels-dropdown class="col-span-1"></channels-dropdown>
              </div>
            </ul>
          </nav>
          <div class="pb-24 sm:pb-32">
            <div class="mt-10 lg:mx-0 lg:max-w-none overflow-x-auto p-1">
              <div class="flex flex-row min-w-[96rem] gap-8">
                <you></you>
                @for (competitor of competitors.others.competitor(); track $index) {
                <competitor [competitor]="competitor" [state]="competitors.others.state()"></competitor>
                <competitor [competitor]="competitor" [state]="competitors.others.state()"></competitor>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CompetitorsComponent {
  competitors = inject(CompetitorsService);

  limitStart = moment().subtract(1, 'year').toDate();
  now = moment().toDate();

  startdate = computed(() => this.competitors.you.filter().startdate);
  enddate = computed(() => this.competitors.you.filter().enddate);

  setStartDate(date: Date) {
    this.competitors.you.filter.set({ ...this.competitors.you.filter(), startdate: date });
    this.competitors.others.filter.set({ ...this.competitors.you.filter(), startdate: date });
  }

  setEndDate(date: Date) {
    this.competitors.you.filter.set({ ...this.competitors.you.filter(), enddate: date });
    this.competitors.others.filter.set({ ...this.competitors.you.filter(), enddate: date });
  }
}
