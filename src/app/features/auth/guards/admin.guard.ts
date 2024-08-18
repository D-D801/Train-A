import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  const alert = inject(AlertService);

  const message = 'You do not have admin rights';

  if (authService.isAdminIn()) {
    return true;
  }
  alert.open({ message, label: 'Error', appearance: 'error' });
  return inject(Router).createUrlTree(['/home']);
};
