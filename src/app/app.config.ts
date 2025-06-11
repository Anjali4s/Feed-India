import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/baseurl.interceptor';
import { csrfInterceptor } from './interceptors/csrf.interceptor';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, csrfInterceptor])
    )
  ]
};
