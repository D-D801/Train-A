import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem(LocalStorageKey.UserToken);
  if (token) {
    const request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(request);
  }
  return next(req);
};
