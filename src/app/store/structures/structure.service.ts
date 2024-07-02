import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
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
import { toObservable } from '@angular/core/rxjs-interop';

export interface StructuresStore {
  selected: {
    structure: RestaurantSettedTO;
    state: StateModel;
  };
  structures: {
    data: RestaurantModel[];
    state: StateModel;
  };
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class StructureStore {
  http = inject(HttpClient);
  router = inject(Router);
  storage = inject(StorageMap);

  private store = signal<StructuresStore>({
    selected: {
      structure: {} as RestaurantSettedTO,
      state: 'loading' as const,
    },
    structures: {
      data: [] as RestaurantModel[],
      state: 'loading' as const,
    },
  });

  structures = computed(() => this.store().structures.data.filter((restaurant) => restaurant.show));
  state = computed(() => this.store().structures.state);
  selected = computed(() => this.store().selected.structure);
  selectedState = computed(() => this.store().selected.state);
  savedSuccesfully = signal(false);
  errors = signal(false);
  structureChanged$ = toObservable(computed(() => this.store().selected.structure._id)).pipe(untilDestroyed(this));

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
        })),
        catchError(() =>
          of({
            selected: { structure: {} as RestaurantSettedTO, state: 'loading' as const },
            structures: {
              data: [],
              state: 'error' as const,
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
      }));
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
          const { url: current } = this.router;
          const page = current.includes('structures') ? '/home' : current;
          this.showAll$.next();
          this.selectedState$.next('loaded');
          this.selected$.next(selected);

          this.router.navigate([page]);
        },
        error: (error) => {
          this.selectedState$.next('error');
          this.router.navigate(['/structures']);
        },
      });
  }

  add(structure: AddRestaurant): Observable<void> {
    const done$ = new Subject<void>();
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
          this.savedSuccesfully.set(true);
          setTimeout(() => this.savedSuccesfully.set(false), 2000);
          this.add$.next(restaurant);
          this.choose(restaurant._id);
          this.router.navigate(['/home']);
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe({
        complete: () => done$.next(),
        next: () => done$.next(),
      });

    return done$;
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
        {
          channels,
        }
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
}
