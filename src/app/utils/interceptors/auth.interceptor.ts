import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap } from 'rxjs';

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
  inject(AuthService)
    .getAccessTokenSilently()
    .pipe(
      switchMap((token) => {
        if (req.headers.get('skip-auth')) return next(req);

        const headers = req.headers.set('Authorization', `Bearer ${token}`);
        const clone = req.clone({ headers });
        return next(clone);
      })
    );
