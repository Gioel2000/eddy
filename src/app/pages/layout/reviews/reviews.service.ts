import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReviewsStore } from '../../../store/reviews/reviews.service';
import { map, tap } from 'rxjs';
import moment from 'moment';

const INIT_FILTER = {
  startdate: undefined,
  enddate: undefined,
  channels: ['thefork', 'tripadvisor', 'google'],
  clients: [],
  offset: 0,
  rows: 5,
};

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  store = inject(ReviewsStore);

  page = signal(1);

  filter: WritableSignal<{
    startdate: Date | undefined;
    enddate: Date | undefined;
    channels: string[];
    clients: string[];
    rows: number;
    offset: number;
  }> = signal(INIT_FILTER);

  constructor() {
    toObservable(this.filter)
      .pipe(
        untilDestroyed(this),
        map(({ startdate, enddate, channels, clients, rows, offset }) => ({
          startdate: startdate ? moment(startdate).format('YYYY-MM-DD') : undefined,
          enddate: enddate ? moment(enddate).format('YYYY-MM-DD') : undefined,
          channels: channels.join(','),
          clients,
          rows,
          offset,
        })),
        tap(() => this.page.set(1))
      )
      .subscribe((filter) => this.store.filter$.next(filter));
  }

  reset() {
    this.filter.set(INIT_FILTER);
  }
}
