import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, combineLatest, map, of, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { StateModel, UserEdit, UserModel, UserTO } from './interface/user';

export interface UserStoreModel {
  user: UserModel;
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class UserStore {
  http = inject(HttpClient);
  auth = inject(AuthService);

  private store = signal<UserStoreModel>({
    user: {} as UserModel,
    state: 'loading' as StateModel,
  });

  me = computed(() => this.store().user);
  status = computed(() => this.store().state);

  private edit$ = new Subject<UserModel>();
  private state$ = new Subject<StateModel>();

  constructor() {
    const next$: Observable<UserStoreModel> = combineLatest({
      systemUser: this.getUser(),
      authUser: this.auth.user$,
    }).pipe(
      untilDestroyed(this),
      map(({ systemUser, authUser }) => ({ ...authUser, ...systemUser } as UserModel)),
      map((user) => ({ user: user as UserModel, state: 'loaded' as const })),
      catchError(() => of({ user: {} as UserModel, state: 'error' as const }))
    );

    connect(this.store)
      .with(next$)
      .with(this.state$, (store, state) => ({
        ...store,
        state: state as StateModel,
      }))
      .with(this.edit$, (store, user) => ({
        ...store,
        user: user as UserModel,
      }));
  }

  edit(payload: UserEdit) {
    this.state$.next('loading');
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('surname', payload.surname);

    if (payload.file) {
      formData.append('file', payload.file);
    }

    this.http
      .put<UserTO>(`${environment.apiUrl}/api/users/me`, formData)
      .pipe(
        tap((user) => {
          this.state$.next('loaded');
          this.edit$.next(user);
        }),
        catchError(() => {
          this.state$.next('error');
          return of(null);
        })
      )
      .subscribe();
  }

  private getUser() {
    return this.http.get<UserTO>(`${environment.apiUrl}/api/users/me`);
  }
}
