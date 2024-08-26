import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DatePickerComponent } from '../../../ui/datepicker/datepicker.component';
import { ChannelsDropdownComponent } from './channels/channels.component';
import { CompetitorsService } from './competitors.service';
import moment from 'moment';
import { YouComponent } from './you/you.component';
import { CompetitorComponent } from './competitor/competitor.component';
import { CompetitorPanelService } from '../../../ui/create-competitor/create-competitor.service';
import { LoaderComponent } from '../../../ui/loader/loader.component';
import { MissingTranslationPipe } from '../../../utils/pipes/missingTranslation.pipe';
import { AddCompetitorDialogService } from '../../../ui/add-competitor-dialog/add-competitor-dialog.service';

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
    LoaderComponent,
    MissingTranslationPipe,
  ],
  template: `
    <ng-template #loading>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-row items-center justify-center w-full">
          <loader></loader>
        </div>
      </div>
    </ng-template>

    <ng-template #empty>
      <div class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-1 text-zinc-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
        </div>
      </div>
    </ng-template>

    <ng-template #error>
      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen">
        <div class="flex flex-col items-center justify-center w-full">
          <span [inlineSVG]="'triangle-warning.svg'" class="svg-icon svg-icon-1 text-red-500 stroke-[1.7]"></span>
          <span class="text-base font-bold text-red-500 mt-1">{{
            'ERROR' | translate | missingTranslation : 'Error'
          }}</span>
        </div>
      </div>
    </ng-template>

    <div class="mx-auto bg-white dark:bg-dark">
      <div class="block">
        <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-6 pb-6">
          <ul
            role="list"
            class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
          >
            <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 w-full xl:w-auto max-w-full gap-y-6">
              <date-picker
                class="col-span-1"
                [i18n]="'STARTDATE'"
                [date]="startdate()"
                [limitStart]="limitStart"
                [limitEnd]="enddate()"
                [rapidDates]="pastRapidDates"
                (onDateSet)="setStartDate($event)"
              ></date-picker>
              <date-picker
                class="col-span-1"
                [i18n]="'ENDDATE'"
                [date]="enddate()"
                [limitStart]="startdate()"
                [limitEnd]="now"
                [rapidDates]="[]"
                (onDateSet)="setEndDate($event)"
              ></date-picker>
              <channels-dropdown class="col-span-2 sm:col-span-1"></channels-dropdown>
            </div>
          </ul>
        </nav>

        <div class="pb-24 sm:pb-32">
          <div #container class="mt-10 lg:mx-0 lg:max-w-none overflow-x-auto p-1">
            <div class="flex flex-row min-w-[96rem] gap-8">
              <you></you>
              @switch (competitors.others.state()) { @case('loaded') { @for (competitor of
              competitors.others.competitors(); track $index) {
              <competitor
                [competitor]="competitor"
                [state]="competitors.others.state()"
                (delete)="delete($event)"
                (exlude)="exlude($event)"
                (include)="include($event)"
              ></competitor>
              } @if (competitors.others.competitors().length < 3) {
              <button
                type="button"
                class="rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                (click)="competitorDialog.openDialog()"
              >
                <div class="gap-y-3 w-96"></div>
              </button>
              } } @case('loading') {
              <div class="rounded-3xl ring-1 ring-zinc-300 dark:ring-zinc-800 min-h-screen w-96 shadow-sm">
                <ng-container *ngTemplateOutlet="loading"></ng-container>
              </div>
              <div class="rounded-3xl ring-1 ring-zinc-300 dark:ring-zinc-800 min-h-screen w-96 shadow-sm">
                <ng-container *ngTemplateOutlet="loading"></ng-container>
              </div>
              } }
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed flex flex-row items-center justify-center gap-x-2 p-2 rounded-2xl right-6 bottom-6 bg-white dark:bg-zinc-800 ring-1  ring-zinc-200 dark:ring-zinc-800 shadow-lg shadow-black/10"
    >
      <button
        class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/10 disabled:opacity-30"
        (click)="scrollLeft()"
      >
        <div
          class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
        >
          <span [inlineSVG]="'arrow-left.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
        </div>
      </button>

      <button
        class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-[10px] w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/10 disabled:opacity-30"
        (click)="scrollRight()"
      >
        <div
          class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
        >
          <span [inlineSVG]="'arrow-right.svg'" class="svg-icon svg-icon-5 stroke-2"></span>
        </div>
      </button>
    </div>
  `,
})
export class CompetitorsComponent {
  @ViewChild('container') container!: ElementRef;

  competitors = inject(CompetitorsService);
  panelUI = inject(CompetitorPanelService);

  competitorDialog = inject(AddCompetitorDialogService);

  limitStart = moment().subtract(3, 'year').toDate();
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

  delete(id: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.competitors.others.delete(id);
  }

  exlude(id: string) {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    this.competitors.others.exlude(id);
  }

  include(id: string) {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    this.competitors.others.include(id);
  }

  scrollLeft() {
    const container = this.container.nativeElement;
    container.scrollTo({
      left: container.scrollLeft - 100,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    const container = this.container.nativeElement;
    container.scrollTo({
      left: container.scrollLeft + 100,
      behavior: 'smooth',
    });
  }

  pastRapidDates = [
    {
      key: 'LAST_MONTH',
      value: moment().subtract(1, 'month').toDate(),
    },
    {
      key: '3_MONTHS_AGO',
      value: moment().subtract(3, 'months').toDate(),
    },
    {
      key: '6_MONTHS_AGO',
      value: moment().subtract(6, 'month').toDate(),
    },
  ];
}
