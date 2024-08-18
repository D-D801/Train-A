import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { ProfileApiService } from '../profile-api/profile-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profileApiService = inject(ProfileApiService);

  private readonly alert = inject(AlertService);

  private readonly router = inject(Router);

  public getUserInformation() {
    return this.profileApiService.getUserInformation().pipe(
      catchError(({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
        this.router.navigate(['/home']);

        return EMPTY;
      })
    );
  }

  public updateUserInformation(label: 'name' | 'email', text: string) {
    return this.profileApiService.updateUserInformation({ [label]: text }).pipe(
      catchError(({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
        return EMPTY;
      }),
      tap((updatedInfo) => {
        this.alert.open({ message: updatedInfo[label], label: `Change ${label}` });
      })
    );
  }

  public updatePassword(newPassword: string) {
    return this.profileApiService.updatePassword({ password: newPassword }).pipe(
      catchError(({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
        return EMPTY;
      }),
      tap(() => {
        this.alert.open({ message: 'Change password' });
      })
    );
  }
}
