import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable({ providedIn: 'root' })
export class TimeoutInterceptor implements HttpInterceptor {
  router = inject(Router);
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req).pipe(
      timeout(timeoutValueNumeric),
      retry(3),
      catchError((error) => {
        if (error.name === 'TimeoutError') this.router.navigate(['/noconnection']);
        return throwError(error);
      })
    );
  }
}
