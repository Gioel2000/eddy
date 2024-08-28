import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { AIReply, ReviewTO, SentimentTO, StateModel, SummaryTO } from './interfaces/reviews';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  filter,
  forkJoin,
  interval,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

export interface ReviewsStoreModel {
  summary: {
    data: SummaryTO;
    state: StateModel;
  };
  list: {
    data: ReviewTO[];
    state: StateModel;
  };
  sentiment: {
    data: SentimentTO[];
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
  sentiment: {
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
    sentimentCategories: string[];
    sentimentWords: string[];
  }>();

  setIsDownloading$ = new Subject<boolean>();

  reviews = computed(() => this.store().list.data);
  state = computed(() => this.store().list.state);

  summary = computed(() => this.store().summary.data);
  summaryState = computed(() => this.store().summary.state);

  sentiment = computed(() => this.store().sentiment.data);
  sentimentState = computed(() => this.store().sentiment.state);

  isDownloading = computed(() => this.store().isDownloading);
  sentimentWordsFilter = signal<string[]>([]);

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

    this.structure.structureChanged$.pipe(untilDestroyed(this)).subscribe(() => this.sentimentWordsFilter.set([]));

    const stream$ = combineLatest({
      selected: this.structure.structureChanged$,
      filter: this.filter$,
    }).pipe(
      untilDestroyed(this),
      filter(({ selected }) => !!selected),
      filter(({ selected }) => Object.keys(selected).length > 0),
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
            sentiment: this.http
              .post<SentimentTO[]>(`${environment.apiUrl}/api/reviews/sentiment/mostusedwords`, filter)
              .pipe(
                map((data) => ({
                  data,
                  state: data.length > 0 ? 'loaded' : 'empty',
                })),
                catchError(() => of({ data: [], state: 'error' }))
              ),
          }),
          isDownloading: this.http
            .get<{ status: 'downloading' | 'completed' }>(`${environment.apiUrl}/api/restaurants/channels/status`)
            .pipe(map((data) => data.status === 'downloading')),
        }).pipe(
          map(({ data, isDownloading }) => ({
            list: data.list,
            summary: data.summary,
            sentiment: data.sentiment,
            isDownloading,
          })),
          tap(({ sentiment }) => {
            if (this.sentimentWordsFilter().length === 0) {
              this.sentimentWordsFilter.set(sentiment.data.map((word) => word.word));
            }
          })
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
      .with(this.setIsDownloading$, (store, isDownloading) => {
        const { isDownloading: isDownloadingCurrent } = store;
        const isDownloadingNext = isDownloading;

        if (isDownloadingCurrent && !isDownloadingNext) {
          this.filter$.next({
            channels: 'thefork,tripadvisor,google',
            clients: [],
            rows: 10,
            offset: 0,
            sentimentCategories: [],
            sentimentWords: [],
          });
        }

        return { ...store, isDownloading };
      });
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

  askAIReply(reviewId: string, language: string) {
    const params = new HttpParams().set('lng', language);
    return this.http.get<AIReply>(`${environment.apiUrl}/api/reviews/${reviewId}/aireply?${params.toString()}`);
  }
}
