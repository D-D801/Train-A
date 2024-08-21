import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanMatchFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthPath = ['registration', 'login'].includes(route.path ?? '');

  return isAuthPath
    ? !authService.isLoggedIn() || router.createUrlTree(['/home'])
    : authService.isLoggedIn() || router.createUrlTree(['/login']);
};
