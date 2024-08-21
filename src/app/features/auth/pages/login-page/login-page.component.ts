import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { emailValidator, requiredValidator } from '@features/auth/validators';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { mailRegex } from '@shared/constants/mail-regex';
import { TuiValidator } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { finalize } from 'rxjs';

@Component({
  selector: 'dd-login-page',
  standalone: true,
  imports: [
    TuiError,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiButton,
    TuiInputPasswordModule,
    TuiInputModule,
    RouterLink,
    TuiValidator,
    NgIf,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly alerts = inject(AlertService);

  private readonly fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  private readonly authService = inject(AuthService);

  private readonly isFormValid = signal(false);

  private readonly isHttpRequesting = signal(false);

  private readonly _isSubmitted = signal(false);

  public readonly isSubmitted = this._isSubmitted.asReadonly();

  public ngOnInit() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this._isSubmitted()) {
        const { email, password } = this.form.value;
        if (email && password) this.isFormValid.set(mailRegex.test(email) && password?.trim().length > 0);
      }
      if (this.form.dirty && this._isSubmitted()) {
        this._isSubmitted.set(false);
        const { email, password } = this.form.controls;
        email.setValidators([Validators.required, emailValidator()]);
        email.updateValueAndValidity();
        password.setValidators(requiredValidator());
        password.updateValueAndValidity();
        this.form.markAllAsTouched();
      }
    });
  }

  public form = this.fb.group({
    email: [''],
    password: [''],
  });

  public onSubmit(): void {
    this._isSubmitted.set(true);
    this.isHttpRequesting.set(true);
    const { email, password } = this.form.value;
    if (!(email && password)) return;
    this.form.markAsPristine();

    this.authService
      .signin({ email, password: password.trim() })
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
        error: ({ error: { message } }) => {
          this.form.controls.email.setErrors({ authError: true });
          this.form.controls.password.setErrors({ authError: true });

          this.alerts.open({ message: message || 'smt went wrong', label: 'Error:', appearance: 'error' });
        },
      });
  }

  public checkSubmitStatus(): boolean {
    return this.isHttpRequesting() || !(this.isFormValid() && this.form.valid);
  }
}
