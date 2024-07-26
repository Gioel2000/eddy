import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { Subject, catchError, filter, forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import { CompetitorTO } from '../competitors/interfaces/competitors';
import { environment } from '../../../environments/environment';
import { GeneralDialogService } from '../../ui/dialog/dialog.service';
import {
  AddCompetitor,
  ChannelsModel,
  ChannelTO,
  CompetitorSuggestedModel,
  CompetitorSuggestedTO,
  RestaurantSettedTO,
  StateModel,
} from './interfaces/competitors';

export interface CompetitorStoreModel {
  competitors: CompetitorSuggestedModel[];
  state: StateModel;
}

export interface ChannelsStoreModel {
  channels: ChannelsModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class SetupStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);
  generalDialog = inject(GeneralDialogService);

  private competitorsStore = signal<CompetitorStoreModel>({
    competitors: [],
    state: 'loading',
  });

  private channelsStore = signal<ChannelsStoreModel>({
    channels: [],
    state: 'loaded',
  });

  step = signal(1);
  stateCompetitors = computed(() => this.competitorsStore().state);
  selected = computed(() => this.competitorsStore().competitors.find((competitor) => competitor.selected));
  competitors = computed(() => this.competitorsStore().competitors);
  channels = computed(() => this.channelsStore().channels);
  stateChannels = computed(() => this.channelsStore().state);

  private stateCompetitors$ = new Subject<StateModel>();
  private stateChannels$ = new Subject<StateModel>();
  private set$ = new Subject<CompetitorSuggestedModel[]>();
  private select$ = new Subject<string>();
  private selectByPlace$ = new Subject<string>();
  private setIdByPlace$ = new Subject<{ placeId: string; newId: string }>();
  private setChannels$ = new Subject<ChannelTO[]>();
  private checkChannelSetup$ = new Subject<string>();
  private removeChannelSetup$ = new Subject<'google' | 'tripadvisor' | 'thefork'>();
  private editChannelSetup$ = new Subject<{ source: 'google' | 'tripadvisor' | 'thefork'; channel: ChannelTO }>();
  private addedCompetitor$ = new Subject<void>();

  constructor() {
    connect(this.competitorsStore)
      .with(this.stateCompetitors$, (store, state) => ({ ...store, state }))
      .with(this.set$, (store, data) => ({ ...store, competitors: data }))
      .with(this.select$, (store, id) => ({
        ...store,
        competitors: store.competitors.map((competitor) => ({
          ...competitor,
          selected: competitor.competitorReference?.id === id,
        })),
      }))
      .with(this.selectByPlace$, (store, placeId) => ({
        ...store,
        competitors: store.competitors.map((competitor) => ({
          ...competitor,
          selected: competitor.place_id === placeId,
        })),
      }))
      .with(this.setIdByPlace$, (store, { placeId, newId }) => {
        const competitor = store.competitors.find((competitor) => competitor.place_id === placeId);

        if (competitor) {
          return {
            ...store,
            competitors: store.competitors.map((c) =>
              c.place_id === placeId
                ? {
                    ...c,
                    selected: true,
                    competitorReference: { id: newId, channels: false },
                  }
                : c
            ),
          };
        }

        return store;
      })
      .with(this.addedCompetitor$, (store) => {
        const competitor = store.competitors.find((competitor) => competitor.selected);
        if (competitor) {
          return {
            ...store,
            competitors: store.competitors.map((c) => (c.selected ? { ...c, selected: false, isAdded: true } : c)),
          };
        }

        return store;
      });

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

  selectByPlace(placeId: string) {
    this.selectByPlace$.next(placeId);
  }

  removeChannelSetup(sourceToRemove: 'google' | 'tripadvisor' | 'thefork') {
    this.removeChannelSetup$.next(sourceToRemove);
  }

  editSetupChannel(source: 'google' | 'tripadvisor' | 'thefork', url: string) {
    const competitorSelected = this.competitors().find((competitor) => competitor.selected)?.competitorReference?.id;
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

  retrive() {
    this.stateCompetitors$.next('loading');

    this.http
      .get<CompetitorSuggestedTO[]>(`${environment.apiUrl}/api/restaurants/competitors/retrieve`)
      .pipe(
        untilDestroyed(this),
        tap((data) => {
          const competitor = data.map((competitor) => ({
            ...competitor,
            selected: false,
            isAdded: competitor.competitorReference?.channels,
          })) as CompetitorSuggestedModel[];
          this.set$.next(competitor);
          this.stateCompetitors$.next(data.length > 0 ? 'loaded' : 'empty');
        }),
        catchError((error) => {
          this.stateCompetitors$.next('error');
          return of(error);
        })
      )
      .subscribe();
  }

  add(competitor: AddCompetitor) {
    this.stateCompetitors$.next('loading');

    this.http
      .post<CompetitorTO>(`${environment.apiUrl}/api/competitors`, competitor)
      .pipe(
        untilDestroyed(this),
        tap(({ _id: newId, googlePlaceId: placeId }) => {
          this.step.set(2);
          this.setIdByPlace$.next({ newId, placeId });
          this.stateCompetitors$.next('loaded');
        }),
        catchError((error) => {
          this.stateCompetitors$.next('error');
          return of(error);
        })
      )
      .subscribe();
  }

  retriveChannels() {
    const competitorSelected = this.competitors().find((competitor) => competitor.selected)?.competitorReference?.id;
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
        tap((channels) => this.setChannels$.next(channels)),
        tap(() => this.stateChannels$.next('loaded')),
        catchError(() => {
          this.stateChannels$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  checkChannelSetup(key: string) {
    this.checkChannelSetup$.next(key);
  }

  saveChannelsSetup(
    channels: {
      source: string;
      url: string;
      id: string;
    }[]
  ) {
    const competitorSelected = this.competitors().find((competitor) => competitor.selected)?.competitorReference?.id;
    if (!competitorSelected) return;

    this.stateChannels$.next('loading');
    this.stateCompetitors$.next('loading');

    this.http
      .put<{ errors: { source: string; status: string }[]; restaurant: RestaurantSettedTO }>(
        `${environment.apiUrl}/api/competitors/${competitorSelected}/channels`,
        { channels }
      )
      .pipe(
        untilDestroyed(this),
        tap((restaurant) => {
          this.stateChannels$.next('loaded');
          this.stateCompetitors$.next('loaded');
          this.addedCompetitor$.next();
        }),
        catchError(() => {
          this.stateChannels$.next('error');
          return of(null);
        })
      )
      .subscribe();
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
