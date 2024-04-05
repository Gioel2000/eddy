import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AddCompetitor, CompetitorModel, CompetitorTO, StateModel } from './interfaces/competitors';
import moment from 'moment';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
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

  competitor = computed(() => this.store().data);
  state = computed(() => this.store().state);

  private state$ = new Subject<StateModel>();
  private add$ = new Subject<CompetitorModel>();
  private delete$ = new Subject<string>();
  private setIsDownloading$ = new Subject<{ competitorId: string; newIsDownloading: boolean }>();

  constructor() {
    const subscription = interval(3000)
      .pipe(
        untilDestroyed(this),
        filter(() => this.competitor().some((competitor) => competitor.isDownloading)),
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
          const competitor = this.competitor().find((competitor) => competitor._id === competitorId);
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
      distinctUntilChanged((prev, curr) => prev.selected === curr.selected && prev.filter === curr.filter)
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
                      reputation: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/graph/average`,
                        filter
                      ),
                      rating: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/rating/grouped`,
                        filter
                      ),
                      clientTypes: this.http.post(
                        `${environment.apiUrl}/api/competitors/${competitor}/clientType/grouped`,
                        filter
                      ),
                      reviews: this.http.post(`${environment.apiUrl}/api/reviews/paginate`, {
                        startdate: filter.startdate,
                        enddate: filter.enddate,
                        channels: filter.channels,
                        rows: 100,
                        offset: 0,
                        clients: [],
                      }),
                      isDownloading: this.http
                        .get<{ status: 'downloading' | 'completed' }>(
                          `${environment.apiUrl}/api/competitors/${competitor}/channels/status`
                        )
                        .pipe(map((data) => data.status === 'downloading')),
                    }).pipe(map((response) => ({ ...data, ...response })))
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
      .with(this.add$, (store, payload) => {
        return {
          ...store,
          data: [
            ...store.data.filter((competitor) => competitor._id !== payload._id),
            { ...payload, isDownloading: true },
          ],
        };
      })
      .with(this.delete$, (store, id) => ({
        ...store,
        data: store.data.filter((competitor) => competitor._id !== id),
      }))
      .with(this.setIsDownloading$, (store, { competitorId, newIsDownloading }) => ({
        ...store,
        data: store.data.map((competitor) =>
          competitor._id === competitorId ? { ...competitor, isDownloading: newIsDownloading } : competitor
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
                  reviews: this.http.get(`${environment.apiUrl}/api/competitors/${competitorsId}/last/week/2`),
                }).pipe(
                  filter(
                    (response) =>
                      !!response.reputation && !!response.rating && !!response.clientTypes && !!response.reviews
                  ),
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
}
