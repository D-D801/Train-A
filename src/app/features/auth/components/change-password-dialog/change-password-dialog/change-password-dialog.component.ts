import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialog, TuiDialogContext, TuiHint } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'dd-change-password-dialog',
  standalone: true,
  imports: [TuiButton, TuiHint, TuiDialog, ReactiveFormsModule, TuiInputModule, TuiAutoFocus],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  private readonly context = inject<TuiDialogContext>(POLYMORPHEUS_CONTEXT);

  private readonly profileService = inject(ProfileService);

  private readonly destroy = inject(DestroyRef);

  protected changePasswordForm = new FormGroup({
    newPassword: new FormControl(''),
  });

  submit() {
    const { newPassword } = this.changePasswordForm.value;

    if (newPassword) {
      this.profileService
        .updatePassword(newPassword)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe(() => this.context.completeWith());
    }
  }
}
