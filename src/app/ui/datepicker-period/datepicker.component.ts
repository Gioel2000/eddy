import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import moment from 'moment';
import { objToDate } from '../../utils/functions/dateFormatter';
import { SubstringPipe } from '../../utils/pipes/substring.pipe';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IsSameDayPipe } from '../../utils/pipes/isSameDay.pipe';
import { MonthNamePipe } from '../../utils/pipes/dayName.pipe';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { IsBetweenDayPipe } from '../../utils/pipes/isBetweenDay.pipe';

export interface CalendarModel {
  year: number;
  month: number;
  firstDay: Date;
  lastDay: Date;
  calendar: {
    week: number;
    days: {
      date: Date;
      day: number;
      month: number;
      year: number;
      isToday: boolean;
      disabled: boolean;
      data?: {
        isStart: boolean;
        isEnd: boolean;
        isPeriod: boolean;
      };
    }[];
  }[];
}

@UntilDestroy()
@Component({
  selector: 'date-picker-period',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ReactiveFormsModule,
    MomentPipe,
    SubstringPipe,
    IsSameDayPipe,
    MonthNamePipe,
    ClickOutsideDirective,
    IsBetweenDayPipe,
  ],
  template: `
    <div
      class="sm:min-w-32 h-full w-full border-none md:border-l border-zinc-200 dark:border-zinc-800"
      (clickOutside)="close()"
    >
      <div class="relative">
        <label
          for="name"
          class="absolute -top-2 left-2 inline-block bg-white dark:bg-dark px-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400"
          >{{ i18n() | translate }}</label
        >
        <button
          #buttonElement
          class="block w-full h-11 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 font-medium focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
          [ngClass]="{
            'ring-2 ring-accent dark:ring-accentDark': showRing(),
            'ring-1 ring-zinc-300 dark:ring-zinc-800': !showRing()
          }"
          (click)="toggle()"
        >
          <div class="flex flex-row items-center justify-between">
            <span>{{
              startdate() ? (startdate() | moment : translate.currentLang : 'DD MMM YYYY') : ('VOID' | translate)
            }}</span>
            <span
              [inlineSVG]="'calendar.svg'"
              class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
            ></span>
          </div>
        </button>

        <div [ngClass]="{ hidden: !isOpen() }">
          <div class="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden dark:bg-neutral-900">
            <div
              class="space-y-0.5 absolute z-10 mt-2 w-80 rounded-[10px] bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 animate-blurToClear200 transform-gpu"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
              [ngClass]="{
                'opacity-100 scale-100': isVisible(),
                'opacity-0 scale-90': !isVisible(),
                'left-0 origin-top-left ': direction() === 'left',
                'right-0 origin-top-right': direction() === 'right'
              }"
            >
              <div class="p-2 gap-x-3 mx-1.5 pb-3 w-full">
                <div class="flex items-center pt-1 pb-3">
                  <h2 class="flex-auto text-base font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                    {{ calendarDays().month | monthName : translate.currentLang }}
                    {{ calendarDays().year }}
                  </h2>
                  <button
                    type="button"
                    class="flex flex-none items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600"
                    (click)="prevMonth()"
                  >
                    <span
                      [inlineSVG]="'chevron-left.svg'"
                      class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                    ></span>
                  </button>
                  <button
                    type="button"
                    class="ml-2 mr-2 flex flex-none items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600"
                    (click)="nextMonth()"
                  >
                    <span
                      [inlineSVG]="'chevron-right.svg'"
                      class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                    ></span>
                  </button>
                </div>
              </div>
              <div class="flex justify-between pb-1.5">
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.MONDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.TUESDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.WEDNESDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.THURSDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.FRIDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.SATURDAY' | translate | substring : 0 : 1 }}
                </span>
                <span class="m-px w-10 block text-center text-xs leading-6 text-zinc-500">
                  {{ 'DAYS.SUNDAY' | translate | substring : 0 : 1 }}
                </span>
              </div>

              <!-- <div class="flex">
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                    disabled
                  >
                    26
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                    disabled
                  >
                    27
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                    disabled
                  >
                    28
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                    disabled
                  >
                    29
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                    disabled
                  >
                    30
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    1
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    2
                  </button>
                </div>
              </div>
              <div class="flex">
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    3
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    4
                  </button>
                </div>
                <div class="bg-zinc-100 rounded-s-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center bg-blue-600 border border-transparent text-sm font-medium text-white hover:border-blue-600 focus:outline-none focus:border-blue-600 rounded-full disabled:text-zinc-300 disabled:pointer-events-none dark:bg-blue-500 dark:hover:border-neutral-700 dark:focus:border-neutral-700"
                  >
                    5
                  </button>
                </div>
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    6
                  </button>
                </div>
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    7
                  </button>
                </div>
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    8
                  </button>
                </div>
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    9
                  </button>
                </div>
              </div>
              <div class="flex">
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    10
                  </button>
                </div>
                <div class="bg-zinc-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    11
                  </button>
                </div>
                <div class="bg-zinc-100 rounded-e-full dark:bg-neutral-800">
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center bg-blue-600 border border-transparent text-sm font-medium text-white hover:border-blue-600 focus:outline-none focus:border-blue-600 rounded-full disabled:text-zinc-300 disabled:pointer-events-none dark:bg-blue-500 dark:hover:border-neutral-700 dark:focus:border-neutral-700"
                  >
                    12
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    13
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    14
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    15
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    16
                  </button>
                </div>
              </div>
              <div class="flex">
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    17
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    18
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    19
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    20
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    21
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    22
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    23
                  </button>
                </div>
              </div>
              <div class="flex">
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    24
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    25
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    26
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    27
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    28
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    29
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    30
                  </button>
                </div>
              </div>
              <div class="flex">
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200"
                  >
                    31
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    1
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    2
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    3
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    4
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    5
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-zinc-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-zinc-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                    disabled
                  >
                    6
                  </button>
                </div>
              </div> -->

              @if (calendarDays(); as calendar) { @for (week of calendar.calendar; track $index) {
              <div class="flex">
                @for (day of week.days; track $index) {
                <div
                  class="flex-auto items-center justify-center"
                  [ngClass]="{
                    'rounded-s-full': startDateChoosed() ? (day.date | isSameDay : startDateChoosed()!): false,
                    'rounded-e-full': endDateChoosed() ? (day.date | isSameDay : endDateChoosed()!): false,
                    'bg-accent text-white': canApply() && isDateBetween(day.date),
                  }"
                >
                  <button
                    type="button"
                    class="m-px size-10 flex justify-center items-center border border-transparent font-medium text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                    [ngClass]="{
                      'hover:bg-zinc-200 dark:text-neutral-200 bg-accent text-white': isSameChoosedDay(day.date) || isDateBetween(day.date),
                      'hover:bg-zinc-200 text-zinc-800': !isSameChoosedDay(day.date) && !isDateBetween(day.date),
                    }"
                    [disabled]="day.disabled"
                    (click)="onClickDaySelected(day.date)"
                  >
                    {{ day.day }}
                  </button>
                </div>
                }
              </div>
              } }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DatePickerPeriodComponent {
  @ViewChild('buttonElement', { read: ElementRef }) buttonElement: ElementRef | undefined;

  translate = inject(TranslateService);
  startdate = input<Date>();
  enddate = input<Date>();
  i18n = input.required<string>();
  limitStart = input.required<Date>();
  limitEnd = input.required<Date>();
  focus = input<boolean>();
  rapidDates = input.required<
    {
      key: string;
      value: Date;
    }[]
  >();

  startDateChoosed = signal<Date | null>(null);
  endDateChoosed = signal<Date | null>(null);
  canApply = computed(
    () =>
      this.startDateChoosed() &&
      this.endDateChoosed() &&
      moment(this.startDateChoosed()).isBefore(this.endDateChoosed())
  );

  direction = signal<'left' | 'right'>('left');

  @Output() applied = new EventEmitter<{
    startdate: Date;
    enddate: Date;
  }>();

  calendarDays = signal<CalendarModel>({
    year: 0,
    month: 0,
    firstDay: moment().toDate(),
    lastDay: moment().toDate(),
    calendar: [
      {
        week: 0,
        days: [
          {
            date: moment().toDate(),
            day: 0,
            month: 0,
            year: 0,
            isToday: false,
            disabled: false,
          },
        ],
      },
    ],
  });
  filter = signal({ month: moment().month(), year: moment().year() });
  isOpen = signal(false);
  isVisible = signal(false);
  showRing = computed(() => this.focus() && this.startdate());

  constructor() {
    toObservable(this.filter)
      .pipe(untilDestroyed(this))
      .subscribe((date) => this.calendarDays.set(this.loadCalendarDays(date)));

    toObservable(this.startdate)
      .pipe(untilDestroyed(this))
      .subscribe((date) => {
        date && this.filter.set(this.loadCalendarDays({ month: date.getMonth(), year: date.getFullYear() }));
      });

    setTimeout(() => {
      const { innerWidth: windowWidth } = window;
      const { right } = (this.buttonElement?.nativeElement?.getBoundingClientRect() as DOMRect) || { right: 0 };

      this.direction.set(windowWidth - right > 200 ? 'left' : 'right');
    }, 0);
  }

  open() {
    this.isOpen.set(true);
    setTimeout(() => this.isVisible.set(true), 0);
  }

  close() {
    this.isVisible.set(false);
    setTimeout(() => this.isOpen.set(false), 200);
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  prevMonth() {
    const { month, year } = this.filter();
    const prevMonth = moment({ month, year }).subtract(1, 'month');
    this.filter.set({ month: prevMonth.month(), year: prevMonth.year() });
  }

  nextMonth() {
    const { month, year } = this.filter();
    const nextMonth = moment({ month, year }).add(1, 'month');
    this.filter.set({ month: nextMonth.month(), year: nextMonth.year() });
  }

  isSameChoosedDay(date: Date): boolean {
    const isStartDateChoosed = (this.startDateChoosed() && this.startDateChoosed() === date) || false;
    const isEndDateChoosed = (this.endDateChoosed() && this.endDateChoosed() === date) || false;

    return (isStartDateChoosed || isEndDateChoosed) as boolean;
  }

  onClickDaySelected(date: Date) {
    if (this.startDateChoosed() && this.endDateChoosed()) {
      this.startDateChoosed.set(date);
      this.endDateChoosed.set(null);
    } else if (this.startDateChoosed()) {
      if (moment(date).isBefore(this.startDateChoosed())) {
        this.startDateChoosed.set(date);
        this.endDateChoosed.set(null);
      } else {
        this.endDateChoosed.set(date);
      }
    } else {
      this.startDateChoosed.set(date);
    }
  }

  isDateBetween(date: Date): boolean {
    return (
      (this.startDateChoosed() &&
        this.endDateChoosed() &&
        moment(date).isBetween(this.startDateChoosed(), this.endDateChoosed(), 'day', '[]')) ||
      false
    );
  }

  onDaySelected(startdate: Date) {
    // this.onDateSet.emit(date);
    // this.close();
  }

  private loadCalendarDays(date: { month: number; year: number }) {
    let calendarDays = [];

    const { month: monthIndex, year: yearIndex } = date;
    const currentMonth = moment({ month: monthIndex, year: yearIndex });
    const prevMonth = currentMonth.subtract(1, 'month');
    const nextMonth = currentMonth.add(1, 'month');
    const firstDayOfCurrentMonth = currentMonth.clone().startOf('month');
    const lastDayOfCurrentMonth = currentMonth.clone().endOf('month');

    while (firstDayOfCurrentMonth.day() !== 1) {
      firstDayOfCurrentMonth.subtract(1, 'day');
      calendarDays.push({
        date: moment({
          day: firstDayOfCurrentMonth.date(),
          month: prevMonth.month() - 1,
          year: prevMonth.year(),
        }).toDate(),
        week: firstDayOfCurrentMonth.week(),
        day: firstDayOfCurrentMonth.date(),
        month: prevMonth.month() - 1,
        year: prevMonth.year(),
        isToday: firstDayOfCurrentMonth.isSame(moment(), 'day'),
        disabled: !firstDayOfCurrentMonth.isSame(currentMonth, 'month'),
      });
    }

    calendarDays.reverse();

    const daysInCurrentMonth = moment().month(monthIndex).daysInMonth();
    const isLeapYear = moment().year(yearIndex).isLeapYear();
    const isFebraury = monthIndex === 1;

    Array.from({
      length: isFebraury && isLeapYear ? 29 : daysInCurrentMonth,
    })
      .map((_, index) =>
        moment()
          .month(monthIndex)
          .year(yearIndex)
          .date(index + 1)
      )
      .forEach((day) =>
        calendarDays.push({
          week: day.week(),
          date: day.toDate(),
          day: day.date(),
          month: day.month(),
          year: day.year(),
          isToday: day.isSame(moment(), 'day'),
          disabled: !day.isSame(currentMonth, 'month'),
        })
      );

    while (lastDayOfCurrentMonth.day() !== 0) {
      lastDayOfCurrentMonth.add(1, 'day');
      calendarDays.push({
        date: moment({
          day: lastDayOfCurrentMonth.date(),
          month: lastDayOfCurrentMonth.month(),
          year: lastDayOfCurrentMonth.year(),
        }).toDate(),
        week: lastDayOfCurrentMonth.week(),
        day: lastDayOfCurrentMonth.date(),
        month: lastDayOfCurrentMonth.month(),
        year: lastDayOfCurrentMonth.year(),
        isToday: lastDayOfCurrentMonth.isSame(moment(), 'day'),
        disabled: !lastDayOfCurrentMonth.isSame(currentMonth, 'month'),
      });
    }

    calendarDays = calendarDays.filter(
      (day, index, self) => index === self.findIndex((d) => d.day === day.day && d.month === day.month)
    );

    if (calendarDays.length <= 42) {
      const { day: lastDay } = calendarDays[calendarDays.length - 1];
      const nextMonth = moment({ day: lastDay, month: monthIndex, year: yearIndex }).add(1, 'month');

      Array.from({ length: 42 - calendarDays.length })
        .map((_, index) =>
          moment()
            .month(monthIndex)
            .year(yearIndex)
            .date(lastDay + index + 1)
        )
        .forEach((day) => {
          calendarDays.push({
            date: day.toDate(),
            day: day.date(),
            week: day.week(),
            month: nextMonth.month(),
            year: nextMonth.year(),
            isToday: false,
            disabled: true,
          });
        });
    }

    const firstDay = objToDate(calendarDays[0]);
    const lastDay = moment(objToDate(calendarDays[calendarDays.length - 1]))
      .add(1, 'day')
      .toDate();

    const calendar = Array.from({ length: 6 }).map((_, index) => ({
      week: index,
      days: calendarDays.slice(index * 7, (index + 1) * 7),
    }));

    return {
      year: yearIndex,
      month: monthIndex,
      firstDay,
      lastDay,
      calendar,
    };
  }
}
