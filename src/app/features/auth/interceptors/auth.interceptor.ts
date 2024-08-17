import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

const KEY_USER_TOKEN = 'userToken';

interface AuthResponse {
  token: string;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/signin')) {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const { token } = event.body as AuthResponse;
          if (token) {
            localStorage.setItem(KEY_USER_TOKEN, token);
          }
        }
      })
    );
  }
  return next(req);
};
