import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { emailValidator, passwordValidator } from '@features/auth/validators';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { RouterLink } from '@angular/router';
import { TuiValidator } from '@taiga-ui/cdk';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { PASSWORD_MAX_LENGTH } from '@shared/constants/password-max-length';

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
export class LoginPageComponent {
  private _isSubmitted = signal(false);

  public isSubmitted = this._isSubmitted.asReadonly();

  private fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  private authService = inject(AuthService);

  public constructor() {
    effect(() => {
      if (this.isSubmitted()) {
        const emailControl = this.form.controls.email;
        const passwordControl = this.form.controls.password;
        emailControl?.setValidators([Validators.required, emailValidator()]);
        emailControl?.updateValueAndValidity();
        passwordControl?.setValidators([Validators.required, passwordValidator(PASSWORD_MAX_LENGTH)]);
        passwordControl?.updateValueAndValidity();
        this.form.markAllAsTouched();
      }
    });
  }

  public form = this.fb.group({
    email: [''],
    password: [''],
  });

  protected onSubmit() {
    this._isSubmitted.set(true);
    const { email, password } = this.form.value;
    if (!(email && password)) return;
    this.authService.signin({ email, password: password.trim() }).pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }

  protected checkSubmitStatus() {
    return this.isSubmitted() ? this.form.invalid : this.form.pristine;
  }
}
