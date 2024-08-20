import { ChangeDetectionStrategy, Component, DestroyRef, inject, INJECTOR } from '@angular/core';
import { TuiButton, TuiAutoColorPipe, TuiDialogService } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
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
  private readonly authService = inject(AuthService);

  private readonly profileService = inject(ProfileService);

  private readonly dialogs = inject(TuiDialogService);

  private readonly injector = inject(INJECTOR);

  private readonly destroy = inject(DestroyRef);

  public control = new FormControl('');

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(ChangePasswordDialogComponent, this.injector),
    {
      dismissible: true,
      label: 'Change Password',
    }
  );

  protected userInformation = this.profileService.getUserInformation();

  protected logout() {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }

  protected showDialog() {
    this.dialog.pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }
}
