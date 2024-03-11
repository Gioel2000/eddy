import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { UserModel, UserTO } from './interface/user';

export interface UserStoreModel {
  user: UserModel;
  state: 'loaded' | 'loading' | 'error';
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class UserStore {
  http = inject(HttpClient);
  auth = inject(AuthService);

  private store = signal<UserStoreModel>({
    user: {} as UserModel,
    state: 'loading',
  });

  me = computed(() => this.store().user);
  status = computed(() => this.store().state);

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

    connect(this.store).with(next$);
  }

  private getUser() {
    return this.http.get<UserTO>(`${environment.apiUrl}/api/users/me`);
  }
}
