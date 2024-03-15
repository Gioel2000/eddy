import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ReviewTO, StateModel, SummaryTO } from './interfaces/reviews';

export interface ReviewsStoreModel {
  summary: {
    data: SummaryTO;
    state: StateModel;
  };
  list: {
    data: ReviewTO[];
    state: StateModel;
  };
}

export const INIT_STATE: ReviewsStoreModel = {
  summary: {
    data: {} as SummaryTO,
    state: 'loading',
  },
  list: {
    data: [],
    state: 'loading',
  },
};

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ReviewsStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private store = signal<ReviewsStoreModel>(INIT_STATE);

  filter$ = new Subject<{
    startdate?: string;
    enddate?: string;
    channels: string;
    clients: string[];
    rows: number;
    offset: number;
  }>();

  reviews = computed(() => this.store().list.data);
  summary = computed(() => this.store().summary.data);
  summaryState = computed(() => this.store().summary.state);
  state = computed(() => this.store().list.state);

  constructor() {
    const stream$ = combineLatest({
      selected: toObservable(this.structure.selected),
      filter: this.filter$,
    }).pipe(
      untilDestroyed(this),
      filter(({ selected }) => !!selected),
      filter(({ selected }) => Object.keys(selected).length > 0),
      distinctUntilChanged((prev, curr) => prev.selected === curr.selected && prev.filter === curr.filter),
      map(({ filter }) => filter),
      filter((filter) => !!filter)
    );

    const next$: Observable<ReviewsStoreModel> = stream$.pipe(
      untilDestroyed(this),
      switchMap((filter) =>
        forkJoin({
          list: this.http.post<ReviewTO[]>(`${environment.apiUrl}/api/reviews/paginate`, filter).pipe(
            // degub
            map((data) => ({
              data,
              state: 'loaded',
            })),
            catchError(() => of({ data: [], state: 'error' }))
          ),
          summary: this.http.post<SummaryTO>(`${environment.apiUrl}/api/reviews/summary`, filter).pipe(
            map((data) => ({ data, state: 'loaded' })),
            catchError(() => of({ data: null, state: 'error' }))
          ),
        })
      ),
      map((data) => data as ReviewsStoreModel)
    );

    connect(this.store)
      .with(next$)
      .with(stream$, () => ({
        list: { data: [], state: 'loading' },
        summary: { data: {} as SummaryTO, state: 'loading' },
      }));
  }

  translate(reviewId: string, lang: string) {
    return this.http.put<{
      description?: { pros: string; cons: string };
      language: string;
      title: string;
    }>(`${environment.apiUrl}/api/reviews/${reviewId}/translate/${lang}`, {});
  }

  setReviewReplied(reviewId: string, replied: boolean) {
    return this.http.put(`${environment.apiUrl}/api/reviews/${reviewId}/setreplied/${replied}`, {});
  }
}
