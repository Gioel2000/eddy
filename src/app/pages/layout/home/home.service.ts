import { Injectable, inject, signal } from '@angular/core';
import { DashboardStore } from '../../../store/dashboard/dashboard.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs';
import moment from 'moment';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class HomeService {
  store = inject(DashboardStore);

  // debug: remove 2019-12-01 and 2020-03-01
  filter = signal({
    startdate: moment('2019-12-01').subtract(2, 'weeks').toDate(),
    enddate: moment('2020-03-01').add(2, 'weeks').toDate(),
    channels: ['thefork', 'tripadvisor', 'google'],
  });

  constructor() {
    toObservable(this.filter)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(
          (prev, curr) =>
            prev.startdate === curr.startdate &&
            prev.enddate === curr.enddate &&
            prev.channels.join(',') === curr.channels.join(',')
        ),
        map(({ startdate, enddate, channels }) => ({
          startdate: moment(startdate).format('YYYY-MM-DD'),
          enddate: moment(enddate).format('YYYY-MM-DD'),
          channels: channels.join(','),
        }))
      )
      .subscribe((filter) => this.store.filter$.next(filter));
  }
}
