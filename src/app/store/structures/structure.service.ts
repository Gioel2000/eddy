import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, Subject, catchError, delay, filter, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import {
  AddRestaurant,
  EditRestaurant,
  RestaurantModel,
  RestaurantSettedTO,
  RestaurantTOModel,
  SetTO,
  StateModel,
} from './interfaces/restaurant';

export interface StructuresStore {
  selected: RestaurantSettedTO | null;
  structures: RestaurantModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class StructureStore {
  http = inject(HttpClient);
  router = inject(Router);
  storage = inject(StorageMap);

  private store = signal<StructuresStore>({
    selected: null,
    structures: [],
    state: 'loading',
  });

  structures = computed(() => this.store().structures.filter((restaurant) => restaurant.show));
  selected = computed(() => this.store().selected);
  state = computed(() => this.store().state);
  savedSuccesfully = signal(false);

  search$ = new Subject<string>();

  private add$ = new Subject<RestaurantTOModel>();
  private delete$ = new Subject<string>();
  private edit$ = new Subject<{ id: string; structure: RestaurantTOModel }>();
  private state$ = new Subject<StateModel>();
  private selected$ = new Subject<RestaurantSettedTO | null>();
  private showAll$ = new Subject<void>();

  constructor() {
    this.storage
      .get('restaurantId', { type: 'string' })
      .pipe(
        untilDestroyed(this),
        filter((id): id is string => !!id),
        tap((id) => this.choose(id))
      )
      .subscribe();

    const next$: Observable<StructuresStore> = this.http
      .get<RestaurantTOModel[]>(`${environment.apiUrl}/api/restaurants`)
      .pipe(
        map((structures) => structures.reverse()),
        mergeMap((structures) => structures),
        map((structure) => ({ ...structure, show: true })),
        toArray(),
        map((structures) => ({ structures, selected: null, state: 'loaded' as const })),
        catchError(() => of({ structures: [], selected: null, state: 'error' as const }))
      );

    connect(this.store)
      .with(next$)
      .with(this.state$, (store, state) => ({ ...store, state }))
      .with(this.selected$, (store, selected) => (selected ? { ...store, selected } : store))
      .with(this.showAll$, (store) => ({
        ...store,
        structures: store.structures.map((restaurant) => ({ ...restaurant, show: true })),
      }))
      .with(this.search$, (store: StructuresStore, search: string) => {
        const filter = (field: 'name' | 'city' | 'address', restaurant: RestaurantModel) =>
          restaurant[field].toLowerCase().includes(search.toLowerCase());

        const fitered = store.structures.filter(
          (restaurant) => filter('name', restaurant) || filter('city', restaurant) || filter('address', restaurant)
        );

        return {
          ...store,
          structures: store.structures.map((restaurant) => ({
            ...restaurant,
            show: fitered.some((h) => h._id === restaurant._id),
          })),
          state: fitered.length > 0 ? ('loaded' as const) : ('empty' as const),
        };
      })
      .with(this.add$, (store, restaurant) => ({
        ...store,
        structures: [{ ...restaurant, show: true }, ...store.structures],
      }))
      .with(this.edit$, (store, { id, structure }) => ({
        ...store,
        structures: store.structures.map((restaurant) =>
          restaurant._id === id ? { ...restaurant, ...structure } : restaurant
        ),
      }))
      .with(this.delete$, (store, id) => ({
        ...store,
        structures: store.structures.filter((restaurant) => restaurant._id !== id),
      }));
  }

  choose(id: string) {
    this.showAll$.next();
    this.state$.next('loading');

    this.http
      .get<SetTO>(`${environment.apiUrl}/api/restaurants/${id}/set`)
      .pipe(
        untilDestroyed(this),
        switchMap(({ expireDate }) => this.storage.set('expireDate', expireDate)),
        switchMap(() => this.storage.set('restaurantId', id)),
        switchMap(() =>
          this.http.get<RestaurantSettedTO>(`${environment.apiUrl}/api/restaurants/current`).pipe(
            delay(200),
            tap((selected) => this.selected$.next(selected))
          )
        ),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe(() => this.router.navigate(['/home']).then(() => this.state$.next('loaded')));
  }

  add(structure: AddRestaurant) {
    this.showAll$.next();
    this.state$.next('loading');

    this.http
      .post<RestaurantTOModel>(`${environment.apiUrl}/api/restaurants`, structure)
      .pipe(
        untilDestroyed(this),
        tap(() => this.state$.next('loaded')),
        tap((restaurant) => this.add$.next(restaurant)),
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

    this.http
      .put<RestaurantTOModel>(`${environment.apiUrl}/api/restaurants/${id}`, restaurant)
      .pipe(
        untilDestroyed(this),
        tap((structure) => this.edit$.next({ id, structure })),
        tap(() => {
          this.state$.next('loaded');
          this.savedSuccesfully.set(true);
          setTimeout(() => this.savedSuccesfully.set(false), 4000);
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
}
