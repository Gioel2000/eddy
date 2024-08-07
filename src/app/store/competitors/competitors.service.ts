import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AddCompetitor, CompetitorModel, CompetitorTO, ReputationModel, StateModel } from './interfaces/competitors';
import moment from 'moment';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  first,
  forkJoin,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';

export interface CompetitorsStoreModel {
  data: CompetitorModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CompetitorsStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private store = signal<CompetitorsStoreModel>({
    data: [{} as CompetitorModel, {} as CompetitorModel],
    state: 'loading',
  });

  filter = signal({
    startdate: moment().subtract(1, 'months').toDate(),
    enddate: moment().toDate(),
    channels: ['thefork', 'tripadvisor', 'google'],
  });

  competitors = computed(() => this.store().data);
  state = computed(() => this.store().state);

  private state$ = new Subject<StateModel>();
  private add$ = new Subject<CompetitorModel>();
  private delete$ = new Subject<string>();
  private setIsDownloading$ = new Subject<{ competitorId: string; newIsDownloading: boolean }>();
  private setExlusion$ = new Subject<{ competitorId: string; isExluded: boolean }>();

  private stateSeup$ = new Subject<StateModel>();

  constructor() {
    const subscription = interval(3000)
      .pipe(
        untilDestroyed(this),
        filter(() => this.competitors().some((competitor) => competitor.isDownloading)),
        switchMap(() => {
          const competitorsIds = this.structure.selected().competitors;

          if (!competitorsIds) return of([]);
          if (competitorsIds.length === 0) return of([]);

          return forkJoin(
            competitorsIds.map((competitor) =>
              this.http
                .get<{ status: 'downloading' | 'completed' }>(
                  `${environment.apiUrl}/api/competitors/${competitor}/channels/status`
                )
                .pipe(map((data) => ({ competitorId: competitor, newIsDownloading: data.status === 'downloading' })))
            )
          );
        })
      )
      .subscribe((newDownload) => {
        newDownload.forEach(({ competitorId, newIsDownloading }) => {
          const competitor = this.competitors().find((competitor) => competitor._id === competitorId);
          if (!competitor) return;
          if (!competitor.reputation || !competitor.rating || !competitor.clientTypes || !competitor.reviews) return;

          this.setIsDownloading$.next({ competitorId, newIsDownloading });
        });

        if (newDownload.every(({ newIsDownloading }) => !newIsDownloading)) {
          subscription.unsubscribe();
        }
      });

    const stream$ = combineLatest({
      selected: toObservable(this.structure.selected),
      filter: toObservable(this.filter).pipe(
        map(({ startdate, enddate, channels }) => ({
          startdate: moment(startdate).format('YYYY-MM-DD'),
          enddate: moment(enddate).format('YYYY-MM-DD'),
          channels: channels.join(','),
        }))
      ),
    }).pipe(
      untilDestroyed(this),
      filter(({ selected }) => !!selected),
      filter(({ selected }) => Object.keys(selected).length > 0),
      distinctUntilChanged(
        (prev, curr) =>
          prev.selected === curr.selected &&
          prev.filter.startdate === curr.filter.startdate &&
          prev.filter.enddate === curr.filter.enddate &&
          prev.filter.channels === curr.filter.channels
      )
    );

    const next$: Observable<CompetitorsStoreModel> = stream$.pipe(
      untilDestroyed(this),
      switchMap(({ selected, filter }) =>
        selected && selected?.competitors?.length > 0
          ? forkJoin(
              selected.competitors.map((competitor) =>
                this.http.get<CompetitorTO>(`${environment.apiUrl}/api/competitors/${competitor}`).pipe(
                  mergeMap((data) =>
                    forkJoin({
                      reputation: this.http
                        .post<ReputationModel>(
                          `${environment.apiUrl}/api/competitors/${competitor}/graph/average`,
                          filter
                        )
                        .pipe(
                          map((response) => ({
                            average: response.average,
                            graph: this.fillWithMissingDays(response.graph, filter.startdate, filter.enddate),
                          }))
                        ),
                      rating: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/rating/grouped`,
                        filter
                      ),
                      clientTypes: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/clientType/grouped`,
                        filter
                      ),
                      categories: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/category/grouped`,
                        filter
                      ),
                      sentiment: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/sentiment/categories`,
                        filter
                      ),
                      reviews: this.http.post(`${environment.apiUrl}/api/competitors/${competitor}/paginate`, {
                        startdate: filter.startdate,
                        enddate: filter.enddate,
                        channels: filter.channels,
                        rows: 100,
                        offset: 0,
                        clients: [],
                      }),
                      channelsRatings: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/channel/grouped`,
                        filter
                      ),
                      isDownloading: this.http
                        .get<{ status: 'downloading' | 'completed' }>(
                          `${environment.apiUrl}/api/competitors/${competitor}/channels/status`
                        )
                        .pipe(map((data) => data.status === 'downloading')),
                    }).pipe(map((response) => ({ ...data, ...response, isExluded: false })))
                  )
                )
              )
            )
          : of([]).pipe(delay(0))
      ),
      map((data) => ({ data, state: 'loaded' } as CompetitorsStoreModel))
    );

    connect(this.store)
      .with(next$)
      .with(stream$, () => ({ data: [{} as CompetitorModel, {} as CompetitorModel], state: 'loading' }))
      .with(this.state$, (store, state) => ({ ...store, state }))
      .with(this.add$, (store, payload) => ({
        ...store,
        data: [
          ...store.data.filter((competitor) => competitor._id !== payload._id),
          { ...payload, isDownloading: true, isExluded: false },
        ],
      }))
      .with(this.delete$, (store, id) => ({
        ...store,
        data: store.data.filter((competitor) => competitor._id !== id),
      }))
      .with(this.setIsDownloading$, (store, { competitorId, newIsDownloading }) => ({
        ...store,
        data: store.data.map((competitor) =>
          competitor._id === competitorId ? { ...competitor, isDownloading: newIsDownloading } : competitor
        ),
      }))
      .with(this.setExlusion$, (store, { competitorId, isExluded }) => ({
        ...store,
        data: store.data.map((competitor) =>
          competitor._id === competitorId ? { ...competitor, isExluded } : competitor
        ),
      }));
  }

  add(competitor: AddCompetitor) {
    this.state$.next('loading');

    const { startdate, enddate, channels } = this.filter();
    const startDateFilter = moment(startdate).format('YYYY-MM-DD');
    const endDateFilter = moment(enddate).format('YYYY-MM-DD');
    const channelsFilter = channels.join(',');

    const filterData = {
      startdate: startDateFilter,
      enddate: endDateFilter,
      channels: channelsFilter,
    };

    this.http
      .post<CompetitorTO>(`${environment.apiUrl}/api/competitors`, competitor)
      .pipe(
        untilDestroyed(this),
        tap((data) => {
          const competitorsId = data._id;
          this.state$.next('loaded');
          this.add$.next(data as CompetitorModel);
          this.setIsDownloading$.next({ competitorId: competitorsId, newIsDownloading: true });

          const subscription = interval(3000)
            .pipe(
              untilDestroyed(this),
              switchMap(() =>
                this.http
                  .get<{ status: 'downloading' | 'completed' }>(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/channels/status`
                  )
                  .pipe(
                    map((data) => ({ competitorId: competitorsId, newIsDownloading: data.status === 'downloading' }))
                  )
              ),
              filter((newDownload) => !newDownload.newIsDownloading),
              switchMap(() =>
                forkJoin({
                  reputation: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/graph/average`,
                    filterData
                  ),
                  rating: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/rating/grouped`,
                    filterData
                  ),
                  clientTypes: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/clientType/grouped`,
                    filterData
                  ),
                  categories: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/category/grouped`,
                    filterData
                  ),
                  sentiment: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/sentiment/categories`,
                    filterData
                  ),
                  reviews: this.http.get(`${environment.apiUrl}/api/competitors/${competitorsId}/last/week/2`),
                  channelsRatings: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/channel/grouped`,
                    filterData
                  ),
                }).pipe(
                  map((response) => ({ ...data, ...response })),
                  map((data) => data as CompetitorModel),
                  tap((response) => {
                    this.add$.next(response);
                    this.setIsDownloading$.next({
                      competitorId: competitorsId,
                      newIsDownloading: false,
                    });
                    subscription.unsubscribe();
                  }),
                  catchError((error) => {
                    this.state$.next('error');
                    return of(error);
                  })
                )
              )
            )
            .subscribe();
        }),
        catchError((error) => {
          this.state$.next('error');
          return of(error);
        })
      )
      .subscribe();
  }

  delete(competitorId: string) {
    this.state$.next('loading');
    this.http
      .delete(`${environment.apiUrl}/api/competitors/${competitorId}`)
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.delete$.next(competitorId);
          this.state$.next('loaded');
        }),
        catchError((error) => {
          this.state$.next('error');
          return of(error);
        })
      )
      .subscribe();
  }

  exlude(competitorId: string) {
    this.setExlusion$.next({ competitorId, isExluded: true });
  }

  include(competitorId: string) {
    this.setExlusion$.next({ competitorId, isExluded: false });
  }

  private fillWithMissingDays(
    data: { date: string; average: number }[],
    startdate: string,
    enddate: string
  ): {
    date: string;
    average: number;
  }[] {
    const momentStartdate = moment(startdate);
    const momentEnddate = moment(enddate);

    let now = momentStartdate.clone();

    const ratings: { date: string; average: number }[] = [];

    while (now.isSameOrBefore(momentEnddate)) {
      const date = now.toDate();

      const currentData = data.find((rating) => now.isSame(moment(rating.date), 'day'))?.average;
      const prevData = ratings[ratings.length - 1]?.average;

      const average = currentData || prevData || 0;

      average && ratings.push({ date: moment(date).format('YYYY-MM-DD'), average });

      now = momentStartdate.clone();
      momentStartdate.add(1, 'day');
    }

    return ratings;
  }
}
