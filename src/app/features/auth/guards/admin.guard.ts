import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  const alerts = inject(TuiAlertService);

  const message = 'You do not have admin rights';

  if (authService.isAdminIn()) {
    return true;
  }
  alerts
    .open(message, {
      label: 'Error:',
      appearance: 'error',
    })
    .subscribe();
  return inject(Router).createUrlTree(['/home']);
};
