import { inject, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CookieGuard {
  private storage = inject(StorageMap);
  private router = inject(Router);

  canActivate() {
    return this.storage.get('expireDate', { type: 'string' }).pipe(
      untilDestroyed(this),
      switchMap((expireDate) =>
        this.storage.get('restaurantId', { type: 'string' }).pipe(
          untilDestroyed(this),
          map((restaurantId) => {
            if (!expireDate || !restaurantId) {
              this.router.navigate(['/structures']);
              return false;
            }

            const expireDateFormatted = moment(expireDate).set({
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            });

            const canActivate = expireDateFormatted ? !moment(new Date()).isAfter(expireDateFormatted) : false;

            !canActivate && this.router.navigate(['/structures']);
            return canActivate;
          })
        )
      )
    );
  }
}
