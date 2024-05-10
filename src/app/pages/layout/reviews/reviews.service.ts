import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReviewsStore } from '../../../store/reviews/reviews.service';
import { distinctUntilChanged, map, skip, tap } from 'rxjs';
import { StructureStore } from '../../../store/structures/structure.service';
import moment from 'moment';

const INIT_FILTER = {
  startdate: undefined,
  enddate: undefined,
  channels: ['thefork', 'tripadvisor', 'google'],
  clients: [],
  offset: 0,
  rows: 5,
  rating: undefined,
  sentimentCategories: [],
  sentimentWords: [],
};

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  store = inject(ReviewsStore);
  structure = inject(StructureStore);

  page = signal(1);

  filter: WritableSignal<{
    startdate: Date | undefined;
    enddate: Date | undefined;
    channels: string[];
    clients: string[];
    sentimentCategories: string[];
    sentimentWords: string[];
    rating: number | undefined;
    rows: number;
    offset: number;
  }> = signal(INIT_FILTER);

  constructor() {
    toObservable(this.filter)
      .pipe(
        untilDestroyed(this),
        map(({ startdate, enddate, channels, clients, rows, offset, sentimentCategories, sentimentWords, rating }) => ({
          startdate: startdate ? moment(startdate).format('YYYY-MM-DD') : undefined,
          enddate: enddate ? moment(enddate).format('YYYY-MM-DD') : undefined,
          channels: channels.join(','),
          clients,
          rows,
          offset,
          sentimentCategories,
          sentimentWords,
          rating,
        }))
      )
      .subscribe((filter) => this.store.filter$.next(filter));

    toObservable(this.filter)
      .pipe(
        map(({ startdate, enddate, channels, clients, sentimentCategories, sentimentWords, rating, rows, offset }) => ({
          startdate: startdate ? moment(startdate).format('YYYY-MM-DD') : undefined,
          enddate: enddate ? moment(enddate).format('YYYY-MM-DD') : undefined,
          channels: channels.join(','),
          sentimentCategories: sentimentCategories.join(','),
          sentimentWords: sentimentWords.join(','),
          clients,
          rating,
        })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => this.page.set(1))
      )
      .subscribe();

    toObservable(this.structure.selected)
      .pipe(
        untilDestroyed(this),
        skip(1),
        distinctUntilChanged((prev, curr) => prev._id === curr._id)
      )
      .subscribe(() => this.reset());
  }

  reset() {
    this.page.set(1);
    this.filter.set(INIT_FILTER);
  }
}
