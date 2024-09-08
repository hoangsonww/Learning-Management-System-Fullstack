import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  return next(clonedRequest);
};
