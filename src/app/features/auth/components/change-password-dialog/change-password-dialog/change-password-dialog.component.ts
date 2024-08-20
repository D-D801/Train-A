import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { passwordValidator } from '@features/auth/validators';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { PASSWORD_MAX_LENGTH } from '@shared/constants/password-max-length';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialog, TuiDialogContext, TuiError, TuiHint } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputPasswordModule } from '@taiga-ui/legacy';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'dd-change-password-dialog',
  standalone: true,
  imports: [
    TuiButton,
    TuiHint,
    TuiDialog,
    ReactiveFormsModule,
    TuiAutoFocus,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiError,
    TuiInputPasswordModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
})
export class ChangePasswordDialogComponent {
  private readonly context = inject<TuiDialogContext>(POLYMORPHEUS_CONTEXT);

  private readonly profileService = inject(ProfileService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(FormBuilder);

  public changePasswordForm = this.fb.group({
    newPassword: this.fb.control('', [Validators.required, passwordValidator(PASSWORD_MAX_LENGTH)]),
  });

  public submit() {
    const { newPassword } = this.changePasswordForm.value;

    if (this.changePasswordForm.valid && newPassword) {
      this.profileService
        .updatePassword(newPassword)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe(() => this.context.completeWith());
    }
  }
}
