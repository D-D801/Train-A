import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  if (authService.isAdminIn()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login']);
};
