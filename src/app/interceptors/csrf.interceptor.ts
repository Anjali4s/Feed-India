import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Attach CSRF token from sessionStorage to every request
  const csrfToken = sessionStorage.getItem('X-CSRF-TOKEN');
  let reqWithCsrf = req;
  if (csrfToken) {
    reqWithCsrf = req.clone({
      headers: req.headers.set('X-CSRF-TOKEN', csrfToken)
    });
  }

  // Continue the request and handle the response
  return next(reqWithCsrf).pipe(
    tap({
      next: (event: any) => {
        // Log the response if it's an HttpResponse
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('x-csrf-token');
          if (newToken) {
            sessionStorage.setItem('X-CSRF-TOKEN', newToken);
          }
        }
      },
      error: (err) => {
        console.error('CSRF Interceptor error:', err);
      }
    })
  );
};
