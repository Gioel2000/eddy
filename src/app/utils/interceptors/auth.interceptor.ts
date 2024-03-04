import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, map, mergeMap, throwError } from 'rxjs';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.headers.get('skip-auth')) {
      return next.handle(request);
    }

    return this.authService.getAccessTokenSilently().pipe(
      untilDestroyed(this),
      map((token) =>
        request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      ),
      mergeMap((tokenReq) => next.handle(tokenReq)),
      catchError((error) => throwError(error))
    );
  }
}
