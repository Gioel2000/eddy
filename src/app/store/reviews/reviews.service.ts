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
  interval,
  map,
  of,
  switchMap,
  tap,
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
  isDownloading: boolean;
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
  isDownloading: false,
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

  setIsDownloading$ = new Subject<boolean>();

  reviews = computed(() => this.store().list.data);
  summary = computed(() => this.store().summary.data);
  summaryState = computed(() => this.store().summary.state);
  state = computed(() => this.store().list.state);
  isDownloading = computed(() => this.store().isDownloading);

  constructor() {
    interval(3000)
      .pipe(
        untilDestroyed(this),
        filter(() => this.isDownloading()),
        switchMap(() =>
          this.http.get<{ status: 'downloading' | 'completed' }>(
            `${environment.apiUrl}/api/restaurants/channels/status`
          )
        ),
        map((data) => data.status === 'downloading')
      )
      .subscribe((isDownloading) => {
        this.setIsDownloading$.next(isDownloading);
      });

    const stream$ = combineLatest({
      // selected: toObservable(this.structure.selected),
      filter: this.filter$,
    }).pipe(
      untilDestroyed(this),
      // filter(({ selected }) => !!selected),
      // filter(({ selected }) => Object.keys(selected).length > 0),
      // distinctUntilChanged((prev, curr) => prev.selected === curr.selected && prev.filter === curr.filter),
      map(({ filter }) => filter),
      filter((filter) => !!filter)
    );

    const next$: Observable<ReviewsStoreModel> = stream$.pipe(
      untilDestroyed(this),
      switchMap((filter) =>
        combineLatest({
          data: forkJoin({
            list: this.http.post<ReviewTO[]>(`${environment.apiUrl}/api/reviews/paginate`, filter).pipe(
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
          }),
          isDownloading: this.http
            .get<{ status: 'downloading' | 'completed' }>(`${environment.apiUrl}/api/restaurants/channels/status`)
            .pipe(map((data) => data.status === 'downloading')),
        }).pipe(
          map(({ data, isDownloading }) => ({
            list: data.list,
            summary: data.summary,
            isDownloading,
          }))
        )
      ),
      map((data) => data as ReviewsStoreModel)
    );

    connect(this.store)
      .with(next$)
      .with(stream$, () => ({
        list: { data: [], state: 'loading' },
        summary: { data: {} as SummaryTO, state: 'loading' },
      }))
      .with(this.setIsDownloading$, (store, isDownloading) => ({ ...store, isDownloading }));
  }

  translate(reviewId: string, lang: string) {
    return this.http.put<{
      text?: string;
      language: string;
      title: string;
    }>(`${environment.apiUrl}/api/reviews/${reviewId}/translate/${lang}`, {});
  }

  setReviewReplied(reviewId: string, replied: boolean) {
    return this.http.put(`${environment.apiUrl}/api/reviews/${reviewId}/setreplied/${replied}`, {});
  }

  askAIReply(reviewId: string) {
    return this.http.get<{ text: string }>(`${environment.apiUrl}/api/reviews/${reviewId}/aireply`);
  }
}
