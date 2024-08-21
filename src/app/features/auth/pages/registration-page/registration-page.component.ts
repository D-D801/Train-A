import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { requiredValidator } from '@features/auth/validators';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { mailRegex } from '@shared/constants/mail-regex';
import { PASSWORD_MAX_LENGTH } from '@shared/constants/password-max-length';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { matchPasswordsValidator, passwordValidator } from '@features/auth/validators/password.validator';
import { Router, RouterLink } from '@angular/router';
import { emailValidator } from '@features/auth/validators/email.validator';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

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
export class RegistrationPageComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly alerts = inject(AlertService);

  private readonly fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  private readonly authService = inject(AuthService);

  private readonly isFormValid = signal(false);

  private readonly isHttpRequesting = signal(false);

  private readonly isSubmitted = signal(false);

  public registrationForm = this.fb.group(
    {
      email: this.fb.control(''),
      password: this.fb.control(''),
      confirmPassword: this.fb.control(''),
    },
    { validators: [matchPasswordsValidator('password', 'confirmPassword')] }
  );

  public ngOnInit() {
    this.registrationForm.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.isSubmitted()) {
        const { email, password } = this.registrationForm.value;
        if (!(email && password)) return;
        this.isFormValid.set(mailRegex.test(email) && password?.trim().length >= PASSWORD_MAX_LENGTH);
      }
      if (this.registrationForm.dirty && this.isSubmitted()) {
        this.isSubmitted.set(false);
        this.setValidators();
      }
    });
  }

  private setValidators() {
    const { email, password } = this.registrationForm.controls;
    email.setValidators([Validators.required, emailValidator()]);
    email.updateValueAndValidity();
    password.setValidators([requiredValidator(), passwordValidator(PASSWORD_MAX_LENGTH)]);
    password.updateValueAndValidity();
    this.registrationForm.markAllAsTouched();
  }

  protected onSubmit() {
    this.isSubmitted.set(true);
    this.isHttpRequesting.set(true);
    const { email, password } = this.registrationForm.value;
    if (!(email && password)) return;
    this.registrationForm.markAsPristine();

    this.authService
      .signup({ email, password: password.trim() })
      .pipe(
        takeUntilDestroyed(this.destroy),
        finalize(() => {
          this.isHttpRequesting.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: ({ error: err }) => {
          if (err.reason === 'invalidUniqueKey')
            this.registrationForm.controls.email.setErrors({ accountExists: true });
          if (err.reason === 'invalidEmail') this.registrationForm.controls.email.setErrors({ emailRegex: true });

          this.alerts.open({ message: err.message || 'smt went wrong', label: 'Error:', appearance: 'error' });
        },
      });
  }

  protected checkSubmitStatus() {
    return this.isHttpRequesting() || !(this.isFormValid() && this.registrationForm.valid);
  }
}
