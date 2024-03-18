import { HttpClient } from '@angular/common/http';
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
import { AddCompetitor, CompetitorModel, CompetitorTO, StateModel } from './interfaces/competitors';
import moment from 'moment';

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
  private setIsDownloading$ = new Subject<{ compeitorId: string; newIsDownloading: boolean }>();

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
                .pipe(map((data) => ({ compeitorId: competitor, newIsDownloading: data.status === 'downloading' })))
            )
          );
        })
      )
      .subscribe((newDownload) => {
        newDownload.forEach(({ compeitorId, newIsDownloading }) => {
          this.setIsDownloading$.next({ compeitorId, newIsDownloading });
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
                      reviews: this.http.get(`${environment.apiUrl}/api/competitors/${competitor}/last/week/2`),
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
      .with(this.add$, (store, payload) => ({ ...store, data: [...store.data, payload] }))
      .with(this.delete$, (store, id) => ({
        ...store,
        data: store.data.filter((competitor) => competitor._id !== id),
      }))
      .with(this.setIsDownloading$, (store, { compeitorId, newIsDownloading }) => ({
        ...store,
        data: store.data.map((competitor) =>
          competitor._id === compeitorId ? { ...competitor, isDownloading: newIsDownloading } : competitor
        ),
      }));
  }

  add(competitor: AddCompetitor) {
    this.state$.next('loading');

    const { startdate, enddate, channels } = this.filter();

    const startDateFilter = moment(startdate).format('YYYY-MM-DD');
    const endDateFilter = moment(enddate).format('YYYY-MM-DD');
    const channelsFilter = channels.join(',');

    const filter = {
      startdate: startDateFilter,
      enddate: endDateFilter,
      channels: channelsFilter,
    };

    this.http
      .post<CompetitorTO>(`${environment.apiUrl}/api/competitors`, competitor)
      .pipe(
        untilDestroyed(this),
        mergeMap((data) =>
          forkJoin({
            reputation: this.http.post(`${environment.apiUrl}/api/competitors/${data._id}/graph/average`, filter),
            rating: this.http.post(`${environment.apiUrl}/api/competitors/${data._id}/rating/grouped`, filter),
            clientTypes: this.http.post(`${environment.apiUrl}/api/competitors/${data._id}/clientType/grouped`, filter),
            reviews: this.http.get(`${environment.apiUrl}/api/competitors/${data._id}/last/week/2`),
            isDownloading: this.http
              .get<{ status: 'downloading' | 'completed' }>(
                `${environment.apiUrl}/api/competitors/${competitor}/channels/status`
              )
              .pipe(map((data) => data.status === 'downloading')),
          }).pipe(map((response) => ({ ...data, ...response })))
        ),
        map((data) => data as CompetitorModel),
        tap((data) => {
          this.add$.next(data);
          this.state$.next('loaded');

          const subscription = interval(3000)
            .pipe(
              untilDestroyed(this),
              switchMap(() => {
                const competitorsId = data._id;
                return this.http
                  .get<{ status: 'downloading' | 'completed' }>(
                    `${environment.apiUrl}/api/competitors/${competitorsId}/channels/status`
                  )
                  .pipe(
                    map((data) => ({ compeitorId: competitorsId, newIsDownloading: data.status === 'downloading' }))
                  );
              })
            )
            .subscribe((newDownload) => {
              this.setIsDownloading$.next(newDownload);
              !newDownload.newIsDownloading && subscription.unsubscribe();
            });
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
