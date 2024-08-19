import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { passwordValidator } from '@features/auth/validators';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialog, TuiDialogContext, TuiError, TuiHint } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'dd-change-password-dialog',
  standalone: true,
  imports: [
    TuiButton,
    TuiHint,
    TuiDialog,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocus,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiError,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  private readonly context = inject<TuiDialogContext>(POLYMORPHEUS_CONTEXT);

  private readonly profileService = inject(ProfileService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(FormBuilder);

  protected changePasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, passwordValidator()]],
  });

  submit() {
    const { newPassword } = this.changePasswordForm.value;

    if (this.changePasswordForm.valid && newPassword) {
      this.profileService
        .updatePassword(newPassword)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe(() => this.context.completeWith());
    }
  }
}
