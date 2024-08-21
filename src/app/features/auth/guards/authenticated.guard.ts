import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth/auth.service';

export const authenticatedGuard: CanMatchFn = () => {
  return !inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/home']);
};
