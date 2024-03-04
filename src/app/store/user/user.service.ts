import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

export interface UserState {
  user: any;
  state: 'loaded' | 'loading' | 'error';
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class UserStore {
  http = inject(HttpClient);
  auth = inject(AuthService);

  private store = signal<UserState>({
    user: null,
    state: 'loading',
  });

  me = computed(() => this.store().user);
  status = computed(() => this.store().state);

  constructor() {
    const next$: Observable<UserState> = combineLatest({
      systemUser: this.getUser(),
      authUser: this.auth.user$,
    }).pipe(
      untilDestroyed(this),
      map(({ systemUser, authUser }) => ({ ...authUser, ...systemUser })),
      map((user) => ({ user, state: 'loaded' as const })),
      catchError(() => of({ user: null, state: 'error' as const }))
    );

    connect(this.store).with(next$);
  }

  private getUser() {
    return this.http.get(`${environment.apiUrl}/api/users/me`);
  }
}
