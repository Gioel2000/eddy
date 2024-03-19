import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { MenuTO, StateModel } from './interface/public-menu';
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
  menu = computed(() => this.store().data);
  state = computed(() => this.store().state);

  constructor() {
    const next$ = this.menuId$.pipe(
      switchMap((id) =>
        this.http.get<any>(`${environment.apiUrl}/api/menus/public/${id}`).pipe(map((data) => data[0] as MenuTO))
      ),
      map((data) => ({ data, state: 'loaded' } as PublicMenuStore)),
      catchError(() => of({ data: {} as MenuTO, state: 'error' } as PublicMenuStore))
    );

    connect(this.store).with(next$);

    effect(() => {
      console.log(this.store());
    });
  }
}