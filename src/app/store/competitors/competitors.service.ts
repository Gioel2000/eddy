import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  AddCompetitor,
  ChannelsModel,
  ChannelTO,
  CompetitorModel,
  CompetitorTO,
  RatingModel,
  ReputationModel,
  StateModel,
} from './interfaces/competitors';
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
  from,
  interval,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { GeneralDialogService } from '../../ui/dialog/dialog.service';
import { RestaurantSettedTO } from '../setup/interfaces/competitors';
import { de } from '@faker-js/faker';

export interface CompetitorsStoreModel {
  data: CompetitorModel[];
  state: StateModel;
}

export interface ChannelsStoreModel {
  channels: ChannelsModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CompetitorsStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);
  generalDialog = inject(GeneralDialogService);

  private store = signal<CompetitorsStoreModel>({
    data: [{} as CompetitorModel, {} as CompetitorModel],
    state: 'loading',
  });

  private channelsStore = signal<ChannelsStoreModel>({
    channels: [],
    state: 'loaded',
  });

  filter = signal({
    startdate: moment().subtract(1, 'months').toDate(),
    enddate: moment().toDate(),
    channels: ['thefork', 'tripadvisor', 'google'],
  });
  step = signal(1);
  selected = signal({} as CompetitorModel);
  competitors = computed(() => this.store().data);
  state = computed(() => this.store().state);
  channels = computed(() => this.channelsStore().channels);
  channelState = computed(() => this.channelsStore().state);

  private state$ = new Subject<StateModel>();
  private add$ = new Subject<CompetitorModel>();
  private delete$ = new Subject<string>();
  private setIsDownloading$ = new Subject<{ competitorId: string; newIsDownloading: boolean }>();
  private setExlusion$ = new Subject<{ competitorId: string; isExluded: boolean }>();
  private stateChannels$ = new Subject<StateModel>();
  private setChannels$ = new Subject<ChannelTO[]>();
  private checkChannelSetup$ = new Subject<string>();
  private removeChannelSetup$ = new Subject<'google' | 'tripadvisor' | 'thefork'>();
  private editChannelSetup$ = new Subject<{ source: 'google' | 'tripadvisor' | 'thefork'; channel: ChannelTO }>();

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
      filter(({ selected }) => !!selected && Object.keys(selected).length > 0)
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
        data: [...store.data.filter((competitor) => competitor._id !== payload._id), { ...payload, isExluded: false }],
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

    connect(this.channelsStore)
      .with(this.stateChannels$, (store, state) => ({ ...store, state }))
      .with(this.setChannels$, (store, suggestedChannels) => {
        const google = suggestedChannels.find((channel) => channel.channel.source === 'google');
        const tripadvisor = suggestedChannels.find((channel) => channel.channel.source === 'tripadvisor');
        const thefork = suggestedChannels.find((channel) => channel.channel.source === 'thefork');

        const channels = [
          { key: 'google', name: 'Google' },
          { key: 'tripadvisor', name: 'TripAdvisor' },
          { key: 'thefork', name: 'The Fork' },
        ];

        const updatedChannels: ChannelsModel[] = channels.map((channel) => {
          if (channel.key === 'google' && google) {
            return { ...channel, channel: google, address: google.address, checked: true } as ChannelsModel;
          }

          if (channel.key === 'tripadvisor' && tripadvisor) {
            return {
              ...channel,
              channel: tripadvisor,
              address: tripadvisor.address,
              checked: false,
            } as ChannelsModel;
          }

          if (channel.key === 'thefork' && thefork) {
            return { ...channel, channel: thefork, address: thefork.address, checked: false } as ChannelsModel;
          }

          return { ...channel, channel: null, address: null, checked: false } as ChannelsModel;
        });

        return {
          ...store,
          channels: updatedChannels,
        };
      })
      .with(this.checkChannelSetup$, (store, key) => {
        const updatedChannels = store.channels.map((channel) =>
          channel.key === key ? { ...channel, checked: true } : channel
        );

        return {
          ...store,
          channels: updatedChannels,
        };
      })
      .with(this.removeChannelSetup$, (store, sourceToRemove) => {
        const updatedChannels = store.channels.map((channel) =>
          channel.key === sourceToRemove ? { ...channel, channel: null } : channel
        );

        return {
          ...store,
          channels: updatedChannels,
        };
      })
      .with(this.editChannelSetup$, (store, { source, channel }) => {
        return {
          ...store,
          channels: store.channels.map((c) =>
            c.key === source ? { ...c, channel, address: channel.address, checked: true } : c
          ),
        };
      });
  }

  add(competitor: AddCompetitor) {
    this.state$.next('loading');
    this.stateChannels$.next('loading');

    this.step.set(2);

    this.http
      .post<CompetitorTO>(`${environment.apiUrl}/api/competitors`, competitor)
      .pipe(
        untilDestroyed(this),
        tap((data) => {
          const competitorId = data._id;
          this.state$.next('loaded');
          this.stateChannels$.next('loading');

          const competitor = {
            reputation: { average: 0, graph: [] } as ReputationModel,
            rating: [] as any[],
            clientTypes: [] as any[],
            reviews: [] as any[],
            categories: [] as any[],
            sentiment: [] as any[],
            channelsRatings: [] as any[],
            isDownloading: false,
            ...data,
            _id: competitorId,
          } as CompetitorModel;

          this.selected.set(competitor);
          this.add$.next(competitor);

          this.retriveChannels();
          this.reloadCompetitor(competitorId);
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

  restartToConfigureChannels(competitor: AddCompetitor, competitorIdToDelete: string) {
    this.state$.next('loading');
    this.stateChannels$.next('loading');

    this.step.set(2);

    this.http
      .delete(`${environment.apiUrl}/api/competitors/${competitorIdToDelete}`)
      .pipe(
        untilDestroyed(this),
        tap(() => this.delete$.next(competitorIdToDelete)),
        switchMap(() =>
          this.http.post<CompetitorTO>(`${environment.apiUrl}/api/competitors`, competitor).pipe(
            untilDestroyed(this),
            tap((data) => {
              const competitorId = data._id;
              this.state$.next('loaded');
              this.stateChannels$.next('loading');

              const competitor = {
                reputation: { average: 0, graph: [] } as ReputationModel,
                rating: [] as any[],
                clientTypes: [] as any[],
                reviews: [] as any[],
                categories: [] as any[],
                sentiment: [] as any[],
                channelsRatings: [] as any[],
                isDownloading: false,
                ...data,
                _id: competitorId,
              } as CompetitorModel;

              this.selected.set(competitor);
              this.add$.next(competitor);

              this.retriveChannels();
              this.reloadCompetitor(competitorId);
            }),
            catchError((error) => {
              this.state$.next('error');
              return of(error);
            })
          )
        ),
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

  checkChannelSetup(key: string) {
    this.checkChannelSetup$.next(key);
  }

  retriveChannels() {
    const competitorSelected = this.selected()?._id;
    if (!competitorSelected) return;

    this.stateChannels$.next('loading');

    this.http
      .get<ChannelTO[]>(`${environment.apiUrl}/api/competitors/${competitorSelected}/channels/retrieve`)
      .pipe(
        untilDestroyed(this),
        switchMap((channels) =>
          forkJoin(
            channels.map((channel) =>
              channel.latitude && channel.longitude
                ? this.getAddress(channel.latitude, channel.longitude).pipe(map((address) => ({ ...channel, address })))
                : of(channel)
            )
          )
        ),
        tap((channels) => {
          this.setChannels$.next(channels);
        }),
        tap(() => this.stateChannels$.next('loaded')),
        catchError(() => {
          this.stateChannels$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  removeChannelSetup(sourceToRemove: 'google' | 'tripadvisor' | 'thefork') {
    this.removeChannelSetup$.next(sourceToRemove);
  }

  editSetupChannel(source: 'google' | 'tripadvisor' | 'thefork', url: string) {
    const competitorSelected = this.selected()?._id;
    if (!competitorSelected) return;

    this.stateChannels$.next('loading');

    this.http
      .post<ChannelTO>(`${environment.apiUrl}/api/competitors/${competitorSelected}/channels/preview`, {
        source,
        url,
      })
      .pipe(
        untilDestroyed(this),
        tap(() => this.stateChannels$.next('loaded')),
        tap((channel) => {
          if (channel === null) {
            this.generalDialog.title.set('ERROR');
            this.generalDialog.description.set('ERROR_URL_CHANNEL');
            this.generalDialog.mode.set('ok');
            this.generalDialog.fuction.set(() => {});
            this.generalDialog.openDialog();
          }
        }),
        filter((channel) => channel !== null),
        switchMap((channel) =>
          channel.latitude && channel.longitude
            ? this.getAddress(channel.latitude, channel.longitude).pipe(map((address) => ({ ...channel, address })))
            : of(channel)
        ),
        tap((channel) => this.editChannelSetup$.next({ source, channel }))
      )
      .subscribe();
  }

  saveChannelsSetup(
    channels: {
      source: string;
      url: string;
      id: string;
    }[]
  ) {
    const competitorSelected = this.selected()?._id;
    if (!competitorSelected) return;

    this.stateChannels$.next('loading');
    this.state$.next('loading');

    this.http
      .put<{ errors: { source: string; status: string }[]; competitor: RestaurantSettedTO }>(
        `${environment.apiUrl}/api/competitors/${competitorSelected}/channels`,
        { channels }
      )
      .pipe(
        untilDestroyed(this),
        tap((restaurant) => {
          const competitorsId = restaurant.competitor._id;
          this.stateChannels$.next('loaded');
          this.state$.next('loaded');
          this.step.set(1);
          this.reloadCompetitor(competitorsId);
        }),
        catchError(() => {
          this.stateChannels$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  private reloadCompetitor(competitorId: string) {
    const competitor = this.competitors().find((competitor) => competitor._id === competitorId);

    if (!competitor) return;

    const { startdate, enddate, channels } = this.filter();
    const startDateFilter = moment(startdate).format('YYYY-MM-DD');
    const endDateFilter = moment(enddate).format('YYYY-MM-DD');
    const channelsFilter = channels.join(',');
    const filterData = {
      startdate: startDateFilter,
      enddate: endDateFilter,
      channels: channelsFilter,
    };

    this.setIsDownloading$.next({ competitorId, newIsDownloading: true });

    const subscription = interval(3000)
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.http
            .get<{ status: 'downloading' | 'completed' }>(
              `${environment.apiUrl}/api/competitors/${competitorId}/channels/status`
            )
            .pipe(map((data) => ({ competitorId: competitorId, newIsDownloading: data.status === 'downloading' })))
        ),
        filter((newDownload) => !newDownload.newIsDownloading),
        switchMap(() =>
          forkJoin({
            reputation: this.http
              .post<ReputationModel>(`${environment.apiUrl}/api/competitors/${competitorId}/graph/average`, filterData)
              .pipe(
                map((response) => ({
                  average: response.average,
                  graph: this.fillWithMissingDays(response.graph, startDateFilter, endDateFilter),
                }))
              ),
            rating: this.http.post(`${environment.apiUrl}/api/competitors/${competitorId}/rating/grouped`, filterData),
            clientTypes: this.http.post(
              `${environment.apiUrl}/api/competitors/${competitorId}/clientType/grouped`,
              filterData
            ),
            categories: this.http.post(
              `${environment.apiUrl}/api/competitors/${competitorId}/category/grouped`,
              filterData
            ),
            sentiment: this.http.post(
              `${environment.apiUrl}/api/competitors/${competitorId}/sentiment/categories`,
              filterData
            ),
            reviews: this.http.get(`${environment.apiUrl}/api/competitors/${competitorId}/last/week/2`),
            channelsRatings: this.http.post(
              `${environment.apiUrl}/api/competitors/${competitorId}/channel/grouped`,
              filterData
            ),
          }).pipe(
            map((response) => ({ ...response })),
            map((data) => data as CompetitorModel),
            tap((response) => {
              this.add$.next({
                ...competitor,
                ...response,
                _id: competitorId,
              });
              this.setIsDownloading$.next({
                competitorId,
                newIsDownloading: false,
              });
              this.selected.set({
                ...competitor,
                ...response,
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

  private getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder().geocode({
      location: { lat, lng },
    });

    return from(geocoder).pipe(
      map((response) => response.results[0].formatted_address),
      catchError(() => of(null))
    );
  }
}
