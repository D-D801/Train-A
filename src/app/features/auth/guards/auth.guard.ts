import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};
