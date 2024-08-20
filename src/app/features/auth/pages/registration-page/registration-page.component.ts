import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { matchPasswordsValidator, passwordValidator } from '@features/auth/validators/password.validator';
import { RouterLink } from '@angular/router';
import { emailValidator } from '@features/auth/validators/email.validator';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { PASSWORD_MAX_LENGTH } from '@shared/constants/password-max-length';

@Component({
  selector: 'dd-registration-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    NgIf,
    NgClass,
    RouterLink,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
})
export class RegistrationPageComponent {
  private readonly fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  private readonly authService = inject(AuthService);

  protected isSubmitted = signal(false);

  public registrationForm = this.fb.group({
    email: this.fb.control(''),
    password: this.fb.control(''),
    confirmPassword: this.fb.control(''),
    name: this.fb.control(''),
  });

  public constructor() {
    effect(() => {
      if (this.isSubmitted()) {
        const emailControl = this.registrationForm.controls.email;
        const passwordControl = this.registrationForm.controls.password;
        emailControl.setValidators([Validators.required, emailValidator()]);
        emailControl.updateValueAndValidity();
        passwordControl.setValidators([Validators.required, passwordValidator(PASSWORD_MAX_LENGTH)]);
        passwordControl.updateValueAndValidity();
        this.registrationForm.setValidators([matchPasswordsValidator('password', 'confirmPassword')]);

        this.registrationForm.markAllAsTouched();
      }
    });
  }

  protected onSubmit() {
    this.isSubmitted.set(true);
    const { email, password } = this.registrationForm.value;
    if (!(email && password)) return;

    this.authService.signup({ email, password: password.trim() }).pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }

  protected checkSubmitStatus() {
    return this.isSubmitted() ? this.registrationForm.invalid : this.registrationForm.pristine;
  }
}
