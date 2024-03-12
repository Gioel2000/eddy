import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { map } from 'rxjs';
import { DatePickerComponent } from '../../../ui/datepicker/datepicker.component';
import { HomeService } from './home.service';
import { ChannelsDropdownComponent } from './channels/channels.component';
import moment from 'moment';
import { BrandReputationComponent } from './widgets/brand-reputation.component';
import { RatingsComponent } from './widgets/ratings.component';
import { TypesComponent } from './widgets/types.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    InlineSVGModule,
    TranslateModule,
    ReactiveFormsModule,
    DatePickerComponent,
    ChannelsDropdownComponent,
    BrandReputationComponent,
    RatingsComponent,
    TypesComponent,
  ],
  template: `
    <div class="h-full lg:pr-10 lg:pl-3 px-4">
      <h1 class="hidden sm:block text-xl font-medium text-zinc-900 dark:text-zinc-100">Home</h1>
      <div class="mx-auto bg-zinc-50 dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 sm:pt-10 pb-6">
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 text-zinc-400 dark:text-zinc-600"
            >
              <form
                [formGroup]="formGroup"
                class="grid gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 w-full sm:w-auto sm:max-w-full gap-y-6"
              >
                <date-picker
                  class="col-span-1"
                  [i18n]="'STARTDATE'"
                  [date]="startdate()"
                  [limitStart]="fourMonthsAgo"
                  [limitEnd]="enddate()"
                  (onDateSet)="setStartDate($event)"
                ></date-picker>
                <date-picker
                  class="col-span-1"
                  [i18n]="'ENDDATE'"
                  [date]="enddate()"
                  [limitStart]="startdate()"
                  [limitEnd]="fourMonthsLater"
                  (onDateSet)="setEndDate($event)"
                ></date-picker>
                <channels-dropdown class="col-span-1"></channels-dropdown>
              </form>
            </ul>
          </nav>
          <brand-reputation-graph></brand-reputation-graph>
          <div
            class="divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
          >
            <div class="bg-zinc-50 dark:bg-dark sm:pr-10 py-6">
              <ratings-graph></ratings-graph>
            </div>
            <div class="bg-zinc-50 dark:bg-dark sm:pl-10 py-6">
              <types-graph></types-graph>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  home = inject(HomeService);

  fourMonthsAgo = moment().subtract(3, 'months').toDate();
  fourMonthsLater = moment().add(3, 'months').toDate();

  formGroup = new FormGroup({
    startdate: new FormControl(moment().subtract(2, 'weeks').toDate()),
    enddate: new FormControl(moment().add(2, 'weeks').toDate()),
  });

  startdate = computed(() => this.home.filter().startdate);
  enddate = computed(() => this.home.filter().enddate);

  errorStartDate = toSignal(
    this.formGroup.valueChanges.pipe(
      map(() => Boolean(this.formGroup.get('startdate')?.invalid || this.formGroup.errors))
    )
  );

  errorEndDate = toSignal(
    this.formGroup.valueChanges.pipe(
      map(() => Boolean(this.formGroup.get('enddate')?.invalid || this.formGroup.errors))
    )
  );

  setStartDate(date: Date) {
    this.home.filter.set({ ...this.home.filter(), startdate: date });
  }

  setEndDate(date: Date) {
    this.home.filter.set({ ...this.home.filter(), enddate: date });
  }
}
