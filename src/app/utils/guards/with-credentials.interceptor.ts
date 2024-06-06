import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const withCredentialsInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (req.headers.get('skip-with-credentials')) return next(req);

  const clone = req.clone({
    withCredentials: true,
  });

  return next(clone);
};
