import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:8081';
    const reqWithBaseUrl = req.clone({
      url: `${baseUrl}${req.url}`,
      withCredentials: true
    });
    return next(reqWithBaseUrl);
};
