import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChannelsModel, ChannelsTOModel } from './interfaces/channels';
import {
  AddRestaurant,
  ChannelModelTO,
  EditRestaurant,
  RestaurantModel,
  RestaurantSettedTO,
  RestaurantTOModel,
  SetTO,
  StateModel,
} from './interfaces/restaurant';
import {
  Observable,
  Subject,
  catchError,
  filter,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { GeneralDialogService } from '../../ui/dialog/dialog.service';

export interface StructuresStore {
  selected: {
    structure: RestaurantSettedTO;
    state: StateModel;
  };
  structures: {
    data: RestaurantModel[];
    state: StateModel;
  };
  setup: {
    data: ChannelsModel[];
    state: StateModel;
  };
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class StructureStore {
  http = inject(HttpClient);
  router = inject(Router);
  storage = inject(StorageMap);
  generalDialog = inject(GeneralDialogService);

  private store = signal<StructuresStore>({
    selected: {
      structure: {} as RestaurantSettedTO,
      state: 'loading' as const,
    },
    structures: {
      data: [] as RestaurantModel[],
      state: 'loading' as const,
    },
    setup: {
      data: [] as ChannelsModel[],
      state: 'loading' as const,
    },
  });

  structures = computed(() => this.store().structures.data.filter((restaurant) => restaurant.show));
  state = computed(() => this.store().structures.state);
  selected = computed(() => this.store().selected.structure);
  selectedState = computed(() => this.store().selected.state);
  channelsSetup = computed(() => this.store().setup.data);
  channelsState = computed(() => this.store().setup.state);
  structureChanged$ = toObservable(computed(() => this.store().selected.structure._id)).pipe(untilDestroyed(this));
  savedSuccesfully = signal(false);
  errors = signal(false);

  search$ = new Subject<string>();

  private add$ = new Subject<RestaurantTOModel>();
  private delete$ = new Subject<string>();
  private edit$ = new Subject<{ id: string; structure: RestaurantTOModel }>();
  private editSelected$ = new Subject<RestaurantTOModel>();
  private state$ = new Subject<StateModel>();
  private selectedState$ = new Subject<StateModel>();
  private selected$ = new Subject<RestaurantSettedTO | null>();
  private showAll$ = new Subject<void>();
  private setChannels$ = new Subject<ChannelModelTO[]>();
  private deleteChannel$ = new Subject<string>();

  private setSetupState$ = new Subject<StateModel>();
  private checkChannelSetup$ = new Subject<string>();
  private editChannelSetup$ = new Subject<{ source: 'google' | 'tripadvisor' | 'thefork'; channel: ChannelsTOModel }>();
  private setChannelsSetup$ = new Subject<ChannelsTOModel[]>();
  private removeChannelSetup$ = new Subject<'google' | 'tripadvisor' | 'thefork'>();

  constructor() {
    const next$: Observable<StructuresStore> = this.http
      .get<RestaurantTOModel[]>(`${environment.apiUrl}/api/restaurants`)
      .pipe(
        map((structures) => structures.reverse()),
        mergeMap((structures) => structures),
        map((structure) => ({ ...structure, show: true })),
        toArray(),
        map((structures) => ({
          selected: { structure: {} as RestaurantSettedTO, state: 'loading' as const },
          structures: {
            data: structures,
            state: structures.length > 0 ? ('loaded' as const) : ('empty' as const),
          },
          setup: {
            data: [],
            state: 'loading' as const,
          },
        })),
        catchError(() =>
          of({
            selected: { structure: {} as RestaurantSettedTO, state: 'loading' as const },
            structures: {
              data: [],
              state: 'error' as const,
            },
            setup: {
              data: [],
              state: 'loading' as const,
            },
          })
        ),
        tap(() => {
          this.storage
            .get('restaurantId', { type: 'string' })
            .pipe(
              untilDestroyed(this),
              filter((id): id is string => !!id),
              tap((id) => this.choose(id))
            )
            .subscribe();
        })
      );

    connect(this.store)
      .with(next$)
      .with(this.state$, (store, state) => ({ ...store, structures: { ...store.structures, state } }))
      .with(this.selectedState$, (store, state) => ({ ...store, selected: { ...store.selected, state } }))
      .with(this.selected$, (store, selected) =>
        selected
          ? {
              ...store,
              selected: { structure: selected, state: 'loaded' as const },
            }
          : store
      )
      .with(this.showAll$, (store) => ({
        ...store,
        structures: {
          ...store.structures,
          data: store.structures.data.map((restaurant) => ({ ...restaurant, show: true })),
        },
      }))
      .with(this.search$, (store: StructuresStore, search: string) => {
        const filter = (field: 'name' | 'city' | 'address', restaurant: RestaurantModel) =>
          restaurant[field].toLowerCase().includes(search.toLowerCase());

        const fitered = store.structures.data.filter(
          (restaurant) => filter('name', restaurant) || filter('city', restaurant) || filter('address', restaurant)
        );

        return {
          ...store,
          structures: {
            data: store.structures.data.map((restaurant) => ({
              ...restaurant,
              show: fitered.some((h) => h._id === restaurant._id),
            })),
            state: fitered.length > 0 ? ('loaded' as const) : ('empty' as const),
          },
        };
      })
      .with(this.add$, (store, restaurant) => ({
        ...store,
        structures: { ...store.structures, data: [{ ...restaurant, show: true }, ...store.structures.data] },
      }))
      .with(this.edit$, (store, { id, structure }) => ({
        ...store,
        structures: {
          ...store.structures,
          data: store.structures.data.map((restaurant) =>
            restaurant._id === id ? { ...restaurant, ...structure } : restaurant
          ),
        },
      }))
      .with(this.editSelected$, (store, structure) => ({
        ...store,
        selected: {
          ...store.selected,
          structure: {
            ...store.selected.structure,
            ...structure,
          },
        },
      }))
      .with(this.delete$, (store, id) => ({
        ...store,
        structures: {
          ...store.structures,
          data: store.structures.data.filter((restaurant) => restaurant._id !== id),
        },
      }))
      .with(this.setChannels$, (store, channels) => ({
        ...store,
        selected: {
          ...store.selected,
          structure: {
            ...store.selected.structure,
            channels: channels,
          },
        },
      }))
      .with(this.deleteChannel$, (store, id) => ({
        ...store,
        selected: {
          ...store.selected,
          structure: {
            ...store.selected.structure,
            channels: store.selected.structure.channels.filter((channel) => channel._id !== id),
          },
        },
      }))
      .with(this.setSetupState$, (store, state) => ({
        ...store,
        setup: { ...store.setup, state },
      }))
      .with(this.setChannelsSetup$, (store, suggestedChannels) => {
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
            return { ...channel, channel: tripadvisor, address: tripadvisor.address, checked: false } as ChannelsModel;
          }

          if (channel.key === 'thefork' && thefork) {
            return { ...channel, channel: thefork, address: thefork.address, checked: false } as ChannelsModel;
          }

          return { ...channel, channel: null, address: null, checked: false } as ChannelsModel;
        });

        return {
          ...store,
          setup: { ...store.setup, data: updatedChannels },
        };
      })
      .with(this.editChannelSetup$, (store, { source, channel }) => {
        return {
          ...store,
          setup: {
            ...store.setup,
            data: store.setup.data.map((c) =>
              c.key === source ? { ...c, channel, address: channel.address, checked: true } : c
            ),
          },
        };
      })
      .with(this.checkChannelSetup$, (store, key) => {
        const updatedChannels = store.setup.data.map((channel) =>
          channel.key === key ? { ...channel, checked: true } : channel
        );

        return {
          ...store,
          setup: { ...store.setup, data: updatedChannels },
        };
      })
      .with(this.removeChannelSetup$, (store, sourceToRemove) => {
        const updatedChannels = store.setup.data.map((channel) =>
          channel.key === sourceToRemove ? { ...channel, channel: null } : channel
        );

        return {
          ...store,
          setup: { ...store.setup, data: updatedChannels },
        };
      });
  }

  choose(id: string) {
    this.showAll$.next();
    this.selectedState$.next('loading');

    this.http
      .get<SetTO>(`${environment.apiUrl}/api/restaurants/${id}/set`)
      .pipe(
        untilDestroyed(this),
        switchMap(({ expireDate }) => this.storage.set('expireDate', expireDate)),
        switchMap(() => this.storage.set('restaurantId', id)),
        switchMap(() => this.http.get<RestaurantSettedTO>(`${environment.apiUrl}/api/restaurants/current`))
      )
      .subscribe({
        next: (selected) => {
          this.routeSetup(selected.status);
          this.showAll$.next();
          this.selectedState$.next('loaded');
          this.selected$.next(selected);
        },
        error: () => {
          this.selectedState$.next('error');
          this.router.navigate(['/structures']);
        },
      });
  }

  add(structure: AddRestaurant) {
    this.showAll$.next();
    this.state$.next('loading');

    const formData = new FormData();
    formData.append('name', structure.name);
    formData.append('city', structure.city);
    formData.append('address', structure.address);
    formData.append('email', structure.email || '');
    formData.append('googleMapsLink', structure.googleMapsLink || '');
    formData.append('website', structure.website);
    formData.append('telephone', structure.telephone);
    formData.append('zipCode', structure.zipCode);
    formData.append('type', structure.type);
    formData.append('googlePlaceId', structure.googlePlaceId);
    formData.append('longitude', structure.longitude.toString());
    formData.append('latitude', structure.latitude.toString());

    if ((structure.image as File | string) instanceof File) {
      formData.append('file', structure.image as File, 'file');
    } else {
      formData.append('image', structure.image as string);
    }

    this.http
      .post<RestaurantTOModel>(`${environment.apiUrl}/api/restaurants`, formData)
      .pipe(
        untilDestroyed(this),
        tap((restaurant) => {
          this.state$.next('loaded');
          this.add$.next(restaurant);
          this.choose(restaurant._id);
          this.routeSetup('created');
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  edit(payload: EditRestaurant) {
    const { id, restaurant } = payload;

    this.showAll$.next();
    this.state$.next('loading');

    const formData = new FormData();
    formData.append('name', restaurant.name);
    formData.append('city', restaurant.city);
    formData.append('address', restaurant.address);
    formData.append('email', restaurant.email || '');
    formData.append('website', restaurant.website);
    formData.append('telephone', restaurant.telephone);
    formData.append('zipCode', restaurant.zipCode);
    formData.append('type', restaurant.type);

    const image = restaurant.image as File | string | null;

    if (image instanceof File) {
      formData.append('file', restaurant.image as File, 'file');
    }

    if (typeof image === 'string') {
      formData.append('image', (restaurant.image || '') as string);
    }

    this.http
      .put<RestaurantTOModel>(`${environment.apiUrl}/api/restaurants`, formData)
      .pipe(
        untilDestroyed(this),
        tap((structure) => {
          this.state$.next('loaded');
          this.edit$.next({ id, structure });
          this.selected()._id === id && this.editSelected$.next(structure);
          this.savedSuccesfully.set(true);
          setTimeout(() => this.savedSuccesfully.set(false), 2000);
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  checkChannelSetup(key: string) {
    this.checkChannelSetup$.next(key);
  }

  loadSuggestedChannels() {
    this.setSetupState$.next('loading');

    this.http
      .get<ChannelsTOModel[]>(`${environment.apiUrl}/api/restaurants/channels/retrieve`)
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
        tap((channels) => this.setChannelsSetup$.next(channels)),
        tap(() => this.setSetupState$.next('loaded')),
        catchError(() => {
          this.setSetupState$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  editSetupChannel(source: 'google' | 'tripadvisor' | 'thefork', url: string) {
    this.setSetupState$.next('loading');

    this.http
      .post<ChannelsTOModel>(`${environment.apiUrl}/api/restaurants/channels/preview`, {
        source,
        url,
      })
      .pipe(
        untilDestroyed(this),
        tap(() => this.setSetupState$.next('loaded')),
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

  removeChannelSetup(sourceToRemove: 'google' | 'tripadvisor' | 'thefork') {
    this.removeChannelSetup$.next(sourceToRemove);
  }

  delete() {
    const structure = this.selected();

    if (!structure) return;

    const { _id: id } = structure;

    this.showAll$.next();
    this.state$.next('loading');
    this.exit();
    this.http
      .delete(`${environment.apiUrl}/api/restaurants`)
      .pipe(
        untilDestroyed(this),
        tap(() => this.delete$.next(id)),
        tap(() => this.state$.next('loaded')),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  saveChannels(
    channels: {
      source: string;
      url: string;
      id: string;
    }[]
  ) {
    this.showAll$.next();
    this.state$.next('loading');

    this.http
      .put<{ errors: { source: string; status: string }[]; restaurant: RestaurantSettedTO }>(
        `${environment.apiUrl}/api/restaurants/channels`,
        { channels }
      )
      .pipe(
        untilDestroyed(this),
        tap(({ errors, restaurant }) => {
          this.state$.next('loaded');
          this.setChannels$.next(restaurant.channels);

          if (errors.find((e) => e.status === 'error')) {
            this.errors.set(true);
            setTimeout(() => this.errors.set(false), 2000);
          } else {
            this.savedSuccesfully.set(true);
            setTimeout(() => this.savedSuccesfully.set(false), 2000);
          }
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
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
    this.showAll$.next();
    this.setSetupState$.next('loading');

    this.http
      .put<{ errors: { source: string; status: string }[]; restaurant: RestaurantSettedTO }>(
        `${environment.apiUrl}/api/restaurants/channels`,
        { channels }
      )
      .pipe(
        untilDestroyed(this),
        switchMap(({ restaurant }) =>
          this.http
            .put<RestaurantTOModel>(`${environment.apiUrl}/api/restaurants`, { status: 'channels' })
            .pipe(map(() => restaurant))
        ),
        tap((restaurant) => {
          this.routeSetup('channels');
          this.edit$.next({ id: restaurant._id, structure: restaurant });
          this.setChannels$.next(restaurant.channels);
          this.editSelected$.next(restaurant);
          setTimeout(() => this.setSetupState$.next('loaded'), 500);
        }),
        catchError(() => {
          this.setSetupState$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  deleteChannel(id: string) {
    this.showAll$.next();
    this.state$.next('loading');

    this.http
      .delete(`${environment.apiUrl}/api/restaurants/channels/${id}`)
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.state$.next('loaded');
          this.savedSuccesfully.set(true);
          this.deleteChannel$.next(id);
          setTimeout(() => this.savedSuccesfully.set(false), 2000);
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  exit() {
    setTimeout(() => {
      this.showAll$.next();
      this.state$.next('loading');

      this.storage
        .delete('restaurantId')
        .pipe(
          untilDestroyed(this),
          switchMap(() => this.storage.delete('expireDate')),
          tap(() => this.selected$.next(null)),
          tap(() => this.state$.next('loaded'))
        )
        .subscribe(() => this.router.navigate(['/structures']));
    }, 500);
  }

  clear() {
    return this.storage.delete('restaurantId').pipe(
      untilDestroyed(this),
      switchMap(() => this.storage.delete('expireDate')),
      tap(() => this.showAll$.next()),
      tap(() => this.selected$.next(null))
    );
  }

  private routeSetup(status: 'created' | 'channels' | 'competitors' | 'completed') {
    const { url: current } = this.router;

    if (status === 'completed') {
      this.router.navigate([current.includes('structures') ? '/home' : current]);
      return;
    }

    const step = () => {
      switch (status) {
        case 'created':
          return 2;
        case 'channels':
          return 3;
        case 'competitors':
          return 4;
      }
    };

    this.router.navigate(['setup', step()]);
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
