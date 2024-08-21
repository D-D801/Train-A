import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { TuiButton, TuiAutoColorPipe, TuiDialogService } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { Router } from '@angular/router';
import { ProfileApiService } from '@features/auth/services/profile-api/profile-api.service';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { tap } from 'rxjs';
import { ProfileFieldComponent } from '../../components/profile-field/profile-field.component';
import { ChangePasswordDialogComponent } from '../../components/change-password-dialog/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'dd-profile-page',
  standalone: true,
  imports: [
    TuiAvatar,
    TuiAutoColorPipe,
    ProfileFieldComponent,
    TuiButton,
    ChangePasswordDialogComponent,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly profileApiService = inject(ProfileApiService);

  private readonly localStorage = inject(LocalStorageService);

  private readonly authService = inject(AuthService);

  private readonly dialogs = inject(TuiDialogService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly router = inject(Router);

  private readonly dialog = this.dialogs
    .open<number>(new PolymorpheusComponent(ChangePasswordDialogComponent), {
      dismissible: true,
      label: 'Change Password',
    })
    .pipe(takeUntilDestroyed());

  protected userInformation = this.profileApiService.getUserInformation().pipe(
    tap({
      error: ({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
        this.router.navigate(['/home']);
      },
    }),
    takeUntilDestroyed(this.destroy)
  );

  protected logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.localStorage.removeItem(LocalStorageKey.UserToken);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  protected showDialog() {
    this.dialog.subscribe();
  }
}
