import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BrandReputationTO, ChannelTO, RatingTO, ReviewTO, StateModel, TypeTO } from './interfaces/dashboard';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import moment from 'moment';
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
} from 'rxjs';

export interface DashboardStoreModel {
  brandReputation: {
    data: BrandReputationTO;
    state: StateModel;
  };
  ratings: {
    data: RatingTO[];
    state: StateModel;
  };
  typologies: {
    data: TypeTO[];
    state: StateModel;
  };
  recentReviews: {
    data: ReviewTO[];
    state: StateModel;
  };
  channels: {
    data: ChannelTO[];
    state: StateModel;
  };
  isDownloading: boolean;
}

export const INIT_STATE: DashboardStoreModel = {
  brandReputation: {
    data: {
      average: 0,
      graph: [],
    },
    state: 'loading',
  },
  ratings: {
    data: [],
    state: 'loading',
  },
  typologies: {
    data: [],
    state: 'loading',
  },
  recentReviews: {
    data: [],
    state: 'loading',
  },
  channels: {
    data: [],
    state: 'loading',
  },
  isDownloading: false,
};

const INIT_FILTER = {
  startdate: moment().subtract(1, 'months').toDate(),
  enddate: moment().toDate(),
  channels: ['thefork', 'tripadvisor', 'google'],
};

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DashboardStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private store = signal<DashboardStoreModel>(INIT_STATE);

  filter = signal({
    startdate: moment().subtract(1, 'months').toDate(),
    enddate: moment().toDate(),
    channels: ['thefork', 'tripadvisor', 'google'],
  });

  filter$ = new Subject<{ startdate: string; enddate: string; channels: string }>();
  setIsDownloading$ = new Subject<boolean>();

  brandReputation = computed(() => this.store().brandReputation);
  ratings = computed(() => this.store().ratings);
  typologies = computed(() => this.store().typologies);
  channels = computed(() => this.store().channels);
  recentReviews = computed(() => this.store().recentReviews);
  isDownloading = computed(() => this.store().isDownloading);

  constructor() {
    const subscription = interval(3000)
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
        !isDownloading && subscription.unsubscribe();
        this.setIsDownloading$.next(isDownloading);
      });

    toObservable(this.filter)
      .pipe(
        untilDestroyed(this),
        map(({ startdate, enddate, channels }) => ({
          startdate: moment(startdate).format('YYYY-MM-DD'),
          enddate: moment(enddate).format('YYYY-MM-DD'),
          channels: channels.join(','),
        }))
      )
      .subscribe((filter) => this.filter$.next(filter));

    const stream$ = combineLatest({
      selected: toObservable(this.structure.selected),
      filter: this.filter$,
    }).pipe(
      untilDestroyed(this),
      filter(({ selected }) => !!selected),
      filter(({ selected }) => Object.keys(selected).length > 0),
      distinctUntilChanged(
        (prev, curr) =>
          prev.filter.startdate === curr.filter.startdate &&
          prev.filter.enddate === curr.filter.enddate &&
          prev.filter.channels === curr.filter.channels &&
          prev.selected === curr.selected
      ),
      map(({ filter }) => filter),
      filter((filter) => !!filter)
    );

    const next$: Observable<DashboardStoreModel> = stream$.pipe(
      untilDestroyed(this),
      switchMap((filter) =>
        combineLatest({
          dashboard: forkJoin({
            brandReputation: this.http
              .post<BrandReputationTO>(`${environment.apiUrl}/api/reviews/graph/average`, filter)
              .pipe(
                map((data) => ({ data, state: data.graph.length > 0 ? ('loaded' as const) : ('empty' as const) })),
                catchError(() =>
                  of({
                    data: { average: 0, graph: [] },
                    state: 'error' as const,
                  })
                )
              ),
            ratings: this.http.post<RatingTO[]>(`${environment.apiUrl}/api/reviews/rating/grouped`, filter).pipe(
              map((data) => ({ data, state: data.length > 0 ? ('loaded' as const) : ('empty' as const) })),
              catchError(() =>
                of({
                  data: [] as RatingTO[],
                  state: 'error' as const,
                })
              )
            ),
            typologies: this.http.post<TypeTO[]>(`${environment.apiUrl}/api/reviews/clientType/grouped`, filter).pipe(
              map((data) => ({ data, state: data.length > 0 ? ('loaded' as const) : ('empty' as const) })),
              catchError(() =>
                of({
                  data: [] as TypeTO[],
                  state: 'error' as const,
                })
              )
            ),
            recentReviews: this.http
              .post<ReviewTO[]>(`${environment.apiUrl}/api/reviews/paginate`, {
                startdate: filter.startdate,
                enddate: filter.enddate,
                channels: 'thefork,tripadvisor,google',
                rows: 100,
                offset: 0,
                clients: [],
              })
              .pipe(
                map((data) => ({ data, state: data.length > 0 ? ('loaded' as const) : ('empty' as const) })),
                catchError(() =>
                  of({
                    data: [] as any,
                    state: 'error' as const,
                  })
                )
              ),
            // debug
            channels: of({
              data: [
                { source: 'thefork', totalRating: 0, filteredRating: 0, totalCount: 0, filteredCount: 0 },
                { source: 'tripadvisor', totalRating: 0, filteredRating: 0, totalCount: 0, filteredCount: 0 },
                { source: 'google', totalRating: 0, filteredRating: 0, totalCount: 0, filteredCount: 0 },
              ],
              state: 'loaded' as const,
            }),
          }),
          isDownloading: this.http
            .get<{ status: 'downloading' | 'completed' }>(`${environment.apiUrl}/api/restaurants/channels/status`)
            .pipe(map((data) => data.status === 'downloading')),
        }).pipe(
          map(({ dashboard, isDownloading }) => ({
            brandReputation: dashboard.brandReputation,
            ratings: dashboard.ratings,
            typologies: dashboard.typologies,
            recentReviews: dashboard.recentReviews,
            channels: dashboard.channels,
            isDownloading,
          }))
        )
      )
    );

    connect(this.store)
      .with(next$)
      .with(stream$, (state) => ({
        ...state,
        brandReputation: { ...state.brandReputation, state: 'loading' },
        ratings: { ...state.ratings, state: 'loading' },
        typologies: { ...state.typologies, state: 'loading' },
        recentReviews: { ...state.recentReviews, state: 'loading' },
      }))
      .with(this.setIsDownloading$, (store, isDownloading) => ({ ...store, isDownloading }));
  }

  reset() {
    this.filter.set(INIT_FILTER);
  }
}
