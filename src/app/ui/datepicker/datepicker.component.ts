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
  days: {
    date: Date;
    day: number;
    month: number;
    year: number;
    isToday: boolean;
    disabled: boolean;
  }[];
}

@UntilDestroy()
@Component({
  selector: 'date-picker',
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
      class="sm:min-w-32 w-full border-none md:border-l border-zinc-200 dark:border-zinc-800"
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
          class="block w-full ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 font-medium focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent rounded-[0.65rem] border-0 py-2.5 px-3 bg-white dark:bg-dark text-zinc-600 dark:text-zinc-200 shadow-sm placeholder:text-zinc-400 placeholder:dark:text-zinc-600 text-sm leading-6"
          [ngClass]="{
            'ring-2 ring-accent dark:ring-accentDark': showRing(),
            'ring-1 ring-zinc-300 dark:ring-zinc-800': !showRing()
          }"
          (click)="toggle()"
        >
          <div class="flex flex-row items-center justify-between">
            <span>{{ date() ? (date() | moment : translate.currentLang : 'DD MMM YYYY') : ('VOID' | translate) }}</span>
            <span
              [inlineSVG]="'calendar.svg'"
              class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
            ></span>
          </div>
        </button>
        <div [ngClass]="{ hidden: !isOpen() }">
          <div
            class="absolute z-10 mt-2 w-80 rounded-[10px] bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 animate-blurToClear200  transform-gpu"
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
            <div role="none">
              <fieldset>
                <div class="space-y-1.5">
                  <div>
                    <div class="flex items-center px-3 pt-3">
                      <h2 class="flex-auto text-base font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                        {{ calendarDays().month | monthName : translate.currentLang }}
                        {{ calendarDays().year }}
                      </h2>
                      <button
                        type="button"
                        class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600"
                        (click)="prevMonth()"
                      >
                        <span
                          [inlineSVG]="'chevron-left.svg'"
                          class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                        ></span>
                      </button>
                      <button
                        type="button"
                        class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600"
                        (click)="nextMonth()"
                      >
                        <span
                          [inlineSVG]="'chevron-right.svg'"
                          class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                        ></span>
                      </button>
                    </div>
                    @if (rapidDates(); as dates) { @if (dates.length > 0) {
                    <div class="grid grid-cols-3 gap-2 px-3 pt-5">
                      @for (date of rapidDates(); track $index) {
                      <span
                        class="col-span-1 inline-flex items-center cursor-pointer transition ease-in-out duration-200 animate-blurToClear200  gap-x-1 rounded-md bg-red-500/10 hover:bg-accent hover:text-white dark:hover:text-white dark:hover:bg-red-500 p-1.5 text-xs text-red-500 font-semibold"
                        (click)="onDateSet.emit(date.value)"
                      >
                        <span [inlineSVG]="'bolt.svg'" class="svg-icon svg-icon-9 stroke-[1.8]"></span>
                        <span>{{ date.key | translate }}</span>
                      </span>
                      }
                    </div>
                    } }
                    <div class="mt-5 grid grid-cols-7 text-center text-xs leading-6 text-zinc-500">
                      <div>{{ 'DAYS.MONDAY' | translate | substring : 0 : 1 }}</div>
                      <div>
                        {{ 'DAYS.TUESDAY' | translate | substring : 0 : 1 }}
                      </div>
                      <div>
                        {{ 'DAYS.WEDNESDAY' | translate | substring : 0 : 1 }}
                      </div>
                      <div>
                        {{ 'DAYS.THURSDAY' | translate | substring : 0 : 1 }}
                      </div>
                      <div>
                        {{ 'DAYS.FRIDAY' | translate | substring : 0 : 1 }}
                      </div>
                      <div>
                        {{ 'DAYS.SATURDAY' | translate | substring : 0 : 1 }}
                      </div>
                      <div>
                        {{ 'DAYS.SUNDAY' | translate | substring : 0 : 1 }}
                      </div>
                    </div>
                    <div class="mt-2 grid grid-cols-7 text-sm">
                      @if (calendarDays(); as calendar) { @for (day of calendar.days; track $index) {
                      <div
                        class="py-2"
                        [ngClass]="{
                          'border-t border-zinc-200 dark:border-zinc-700': $index >= 7,
                          'text-zinc-400 dark:text-zinc-600': day.disabled,
                          'text-zinc-900 dark:text-zinc-100': !day.disabled
                        }"
                      >
                        <button
                          type="button"
                          class="mx-auto flex h-7 w-7 items-center justify-center rounded-full font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                          [ngClass]="{
                            'bg-accent dark:bg-accentDark font-semibold text-white':
                              !day.disabled && (day.date | isSameDay : date())
                          }"
                          [disabled]="!(day.date | isBetweenDay : limitStart() : limitEnd()) || day.disabled"
                          (click)="onDaySelected(day.date)"
                        >
                          <time [attr.datetime]="day.date">{{ day.day }}</time>
                        </button>
                      </div>
                      } }
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DatePickerComponent {
  @ViewChild('buttonElement', { read: ElementRef }) buttonElement: ElementRef | undefined;

  translate = inject(TranslateService);
  date = input<Date>();
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

  direction = signal<'left' | 'right'>('left');

  @Output() onDateSet = new EventEmitter<Date>();

  calendarDays = signal<CalendarModel>({
    year: 0,
    month: 0,
    firstDay: moment().toDate(),
    lastDay: moment().toDate(),
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
  });
  filter = signal({ month: moment().month(), year: moment().year() });
  isOpen = signal(false);
  isVisible = signal(false);
  showRing = computed(() => this.focus() && this.date());

  constructor() {
    toObservable(this.filter)
      .pipe(untilDestroyed(this))
      .subscribe((date) => this.calendarDays.set(this.loadCalendarDays(date)));

    toObservable(this.date)
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

  onDaySelected(date: Date) {
    this.onDateSet.emit(date);
    this.close();
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

    return {
      year: yearIndex,
      month: monthIndex,
      firstDay,
      lastDay,
      days: calendarDays,
    } as CalendarModel;
  }
}
