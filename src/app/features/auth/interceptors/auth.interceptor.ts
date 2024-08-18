import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { KEY_USER_TOKEN } from '@shared/constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem(KEY_USER_TOKEN);
  if (token) {
    const request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(request);
  }
  return next(req);
};
