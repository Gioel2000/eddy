import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subject, catchError, map, of, switchMap, tap } from 'rxjs';
import { UserPayload, StateModel, UserTO } from './interfaces/users';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';

export interface UsersStoreModel {
  users: UserTO[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class UsersStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private store = signal<UsersStoreModel>({
    users: [],
    state: 'loading',
  });

  users = computed(() => this.store().users);
  state = computed(() => this.store().state);

  private state$ = new Subject<StateModel>();
  private add$ = new Subject<UserTO>();
  private edit$ = new Subject<UserTO>();
  private delete$ = new Subject<string>();

  constructor() {
    const next$: Observable<UsersStoreModel> = toObservable(this.structure.selected).pipe(
      untilDestroyed(this),
      tap(() => this.state$.next('loading' as const)),
      switchMap(() => this.http.get<UserTO[]>(`${environment.apiUrl}/api/users`)),
      map((users) => ({ users, state: users.length ? ('loaded' as const) : ('empty' as const) })),
      catchError(() => of({ users: [] as UserTO[], state: 'error' as const }))
    );

    connect(this.store)
      .with(next$)
      .with(this.state$, (store, state) => ({ ...store, state }))
      .with(this.add$, (store, payload) => ({ ...store, users: [payload, ...store.users] }))
      .with(this.edit$, (store, payload) => ({
        ...store,
        users: store.users.map((user) => (user._id === payload._id ? payload : user)),
      }))
      .with(this.delete$, (store, id) => ({ ...store, users: store.users.filter((user) => user._id !== id) }));
  }

  add(payload: UserPayload) {
    this.state$.next('loading' as const);

    this.http
      .post<UserTO>(`${environment.apiUrl}/api/users`, payload)
      .pipe(
        untilDestroyed(this),
        tap((user) => this.add$.next(user)),
        tap(() => this.state$.next('loaded' as const)),
        catchError(() => {
          this.state$.next('error' as const);
          return of(null);
        })
      )
      .subscribe();
  }

  edit(id: string, payload: UserPayload) {
    this.state$.next('loading' as const);

    this.http
      .put<UserTO>(`${environment.apiUrl}/api/users/${id}`, payload)
      .pipe(
        untilDestroyed(this),
        tap((user) => this.edit$.next(user)),
        tap(() => this.state$.next('loaded' as const)),
        catchError(() => {
          this.state$.next('error' as const);
          return of(null);
        })
      )
      .subscribe();
  }

  delete(id: string) {
    this.state$.next('loading' as const);

    this.http
      .delete<UserTO>(`${environment.apiUrl}/api/users/${id}`)
      .pipe(
        untilDestroyed(this),
        tap(() => this.delete$.next(id)),
        tap(() => this.state$.next('loaded' as const)),
        catchError(() => {
          this.state$.next('error' as const);
          return of(null);
        })
      )
      .subscribe();
  }
}
