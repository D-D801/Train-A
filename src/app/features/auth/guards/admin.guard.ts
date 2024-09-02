import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Role } from '@shared/enums/role.enum';

export const adminGuard: CanMatchFn = () => {
  const authService: AuthService = inject(AuthService);

  const alert = inject(AlertService);

  const message = 'You do not have admin rights';

  if (authService.role() === Role.manager) {
    return true;
  }
  alert.open({ message, label: 'Error', appearance: 'error' });
  return inject(Router).createUrlTree(['/home']);
};
