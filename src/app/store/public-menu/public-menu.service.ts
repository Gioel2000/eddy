import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Dish, MenuTO, StateModel } from './interface/public-menu';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicMenuStore {
  data: MenuTO;
  state: StateModel;
}

export const INIT_STATE: PublicMenuStore = {
  data: {} as MenuTO,
  state: 'loading',
};

@Injectable({ providedIn: 'root' })
export class PublicMenuStoreService {
  private store = signal<PublicMenuStore>(INIT_STATE);
  private http = inject(HttpClient);

  menuId$ = new Subject<string>();
  search$ = new Subject<string>();

  menu = computed(() => this.store().data);
  state = computed(() => this.store().state);

  constructor() {
    const next$ = this.menuId$.pipe(
      switchMap((id) =>
        this.http
          .get<any>(`${environment.apiUrl}/api/menus/public/${id}`, {
            headers: {
              'skip-with-credentials': 'true',
              'skip-auth': 'true',
            },
          })
          .pipe(map((data) => data[0] as MenuTO))
      ),
      map((menu) => {
        return {
          data: {
            ...menu,
            dishes: menu.dishes.map((dish) => ({ ...dish, dish: { ...dish.dish, show: true } })),
          },
          state: 'loaded',
        } as PublicMenuStore;
      }),
      catchError(() => of({ data: {} as MenuTO, state: 'error' } as PublicMenuStore))
    );

    connect(this.store)
      .with(next$)
      .with(this.search$, (store: PublicMenuStore, search: string) => {
        const filter = (field: 'name' | 'description', dish: Dish) =>
          dish.dish[field].toLowerCase().includes(search.toLowerCase());

        return {
          data: {
            ...store.data,
            dishes: store.data.dishes.map((dish) => ({
              ...dish,
              dish: { ...dish.dish, show: filter('name', dish) || filter('description', dish) },
            })),
          },
          state: store.state,
        } as PublicMenuStore;
      });
  }
}
