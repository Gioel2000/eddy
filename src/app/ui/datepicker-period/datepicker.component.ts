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
import { IsBeforePipe } from '../../utils/pipes/isBefore.pipe';
import { filter } from 'rxjs';

export interface CalendarModel {
  year: number;
  month: number;
  firstDay: Date;
  lastDay: Date;
  calendar: {
    week: number;
    days: {
      index: number;
      date: Date;
      day: number;
      month: number;
      year: number;
      isToday: boolean;
      disabled: boolean;
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
    IsBeforePipe,
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
          <div class="flex flex-row items-center justify-between gap-x-1">
            <span
              >{{
                startDateChoosed()
                  ? (startDateChoosed() | moment : translate.currentLang : 'DD MMM')
                  : ('VOID' | translate)
              }}
              -
              {{
                endDateChoosed() ? (endDateChoosed() | moment : translate.currentLang : 'DD MMM') : ('VOID' | translate)
              }}</span
            >
            <span
              [inlineSVG]="'calendar.svg'"
              class="svg-icon svg-icon-8 text-zinc-600 dark:text-zinc-400 stroke-[1.8]"
            ></span>
          </div>
        </button>

        <div [ngClass]="{ hidden: !isOpen() }">
          <div class="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden dark:bg-neutral-900">
            <div
              class="space-y-0.5 absolute z-10 mt-2 w-[280px] rounded-[10px] bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200 animate-blurToClear200 transform-gpu"
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
                <div class="flex items-center pt-1 pb-1">
                  <h2 class="flex-auto text-base font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                    {{ calendarDays().month | monthName : translate.currentLang }}
                    {{ calendarDays().year }}
                  </h2>
                  <button
                    type="button"
                    class="flex flex-none items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all transform-gpu ease-in-out duration-100 justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 disabled:opacity-30"
                    [disabled]="!canGoToPrevMonth()"
                    (click)="prevMonth()"
                  >
                    <span
                      [inlineSVG]="'chevron-left.svg'"
                      class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                    ></span>
                  </button>
                  <button
                    type="button"
                    class="ml-2 mr-2 flex flex-none items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all transform-gpu ease-in-out duration-100 justify-center p-1.5 text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 disabled:opacity-30"
                    [disabled]="!canGoToNextMonth()"
                    (click)="nextMonth()"
                  >
                    <span
                      [inlineSVG]="'chevron-right.svg'"
                      class="svg-icon svg-icon-9 text-zinc-400 dark:text-zinc-600 stroke-[1.8]"
                    ></span>
                  </button>
                </div>
              </div>
              @if (rapidDates(); as dates) { @if (dates.length > 0) {
              <div class="grid grid-cols-2 gap-1.5 px-3 pb-6">
                @for (date of rapidDates(); track $index) {
                <a
                  class="col-span-1 inline-flex items-center cursor-pointer transition ease-in-out duration-200 animate-blurToClear200  gap-x-1 rounded-md bg-red-500/10 hover:bg-accent hover:text-white dark:hover:text-white dark:hover:bg-red-500 p-1.5 text-xs text-red-500 font-semibold"
                  (click)="applyRapidDate(date.value)"
                >
                  <span [inlineSVG]="'bolt.svg'" class="svg-icon svg-icon-9 stroke-[1.8]"></span>
                  <span class="truncate">{{ date.key | translate }}</span>
                </a>
                }
              </div>
              } }
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

              @if (calendarDays(); as calendar) { @for (week of calendar.calendar; track week.week) {
              <div class="flex">
                @for (day of week.days; track $index) { @let isStartDateChoosed = startDateChoosed() ? (day.date |
                isSameDay : startDateChoosed()!): false; @let isEndDateChoosed = endDateChoosed() ? (day.date |
                isSameDay : endDateChoosed()!): false; @let isDateBetween = day.date | isBetweenDay :
                startDateChoosed()! : endDateChoosed()!;
                <div
                  class="flex items-center justify-center w-10"
                  [ngClass]="{
                    'rounded-s-full': isStartDateChoosed,
                    'rounded-e-full': isEndDateChoosed,
                    'bg-accent dark:bg-accentDark text-white': canApply() && isDateBetween,
                    'rounded-br-[10px]': day.index === 41 && !showReset(),
                    'rounded-bl-[10px]': day.index === 35 && !showReset(),
                  }"
                >
                  <button
                    type="button"
                    class="size-10 flex justify-center items-center border border-transparent font-medium text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                    [ngClass]="{
                      'hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-200 bg-accent dark:bg-accentDark text-white': (isStartDateChoosed || isEndDateChoosed) || isDateBetween,
                      'hover:bg-zinc-100 text-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-200 ': !(isStartDateChoosed || isEndDateChoosed) && !isDateBetween,
                    }"
                    [disabled]="!(day.date | isBetweenDay : limitStart() : limitEnd()) || day.disabled"
                    (click)="onClickDaySelected(day.date)"
                  >
                    {{ day.day }}
                  </button>
                </div>
                }
              </div>
              } } @if(showReset()) {
              <div
                class="flex flex-row items-center justify-end py-2.5 px-2 border-t border-zinc-200 dark:border-zinc-700"
              >
                <button
                  type="button"
                  class="flex flex-row items-center rounded-lg px-2.5 py-2 text-zinc-900 dark:text-zinc-100 cursor-pointer text-sm shadow-sm shadow-zinc-950/20 font-medium ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition ease-in-out duration-200 animate-blurToClear200"
                  (click)="reset()"
                >
                  {{ 'RESET' | translate }}
                </button>
              </div>
              }
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
  showReset = input<boolean>();

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
            index: 0,
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
      .pipe(
        untilDestroyed(this),
        filter((date): date is Date => !!date)
      )
      .subscribe((date) => {
        this.filter.set(this.loadCalendarDays({ month: date.getMonth(), year: date.getFullYear() }));
        this.startDateChoosed.set(date);
      });

    toObservable(this.enddate)
      .pipe(
        untilDestroyed(this),
        filter((date): date is Date => !!date)
      )
      .subscribe((date) => {
        this.endDateChoosed.set(date);
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

  canGoToNextMonth() {
    const { month, year } = this.filter();
    const nextMonth = moment({ month, year }).add(1, 'month');
    return moment(nextMonth).isBefore(moment());
  }

  canGoToPrevMonth() {
    const { month, year } = this.filter();
    const prevMonth = moment({ month, year });
    return moment(prevMonth).isAfter(moment(this.limitStart()));
  }

  applyRapidDate(date: Date) {
    console.log(date);
    this.startDateChoosed.set(date);
    this.endDateChoosed.set(moment().toDate());
    this.applied.emit({
      startdate: this.startDateChoosed()!,
      enddate: this.endDateChoosed()!,
    });
    this.close();
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
        this.applied.emit({
          startdate: this.startDateChoosed()!,
          enddate: this.endDateChoosed()!,
        });
        this.close();
      }
    } else {
      this.startDateChoosed.set(date);
    }
  }

  reset() {
    this.startDateChoosed.set(null);
    this.endDateChoosed.set(null);

    this.applied.emit({
      startdate: this.startDateChoosed()!,
      enddate: this.endDateChoosed()!,
    });
    this.close();
  }

  private loadCalendarDays(date: { month: number; year: number }) {
    let calendarDays = [];
    let index = 0;

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
          month: firstDayOfCurrentMonth.month(),
          year: firstDayOfCurrentMonth.year(),
        }).toDate(),
        week: firstDayOfCurrentMonth.week(),
        day: firstDayOfCurrentMonth.date(),
        month: firstDayOfCurrentMonth.month(),
        year: firstDayOfCurrentMonth.year(),
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
            date: moment(day).month(monthIndex).add(1, 'month').toDate(),
            day: moment(day).month(monthIndex).add(1, 'month').date(),
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

    calendarDays = calendarDays.map((day) => ({
      ...day,
      index: index++,
    }));

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
