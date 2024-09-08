import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const config: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom([])
  ]
};
