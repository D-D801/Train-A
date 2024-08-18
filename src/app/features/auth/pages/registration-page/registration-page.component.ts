import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AuthService } from '@features/auth/services/auth.service';
import { builInErrors } from '@shared/constants/built-in-errors.constant';
import { matchPasswordsValidator } from '@features/auth/validators/password.validator';
import { RouterLink } from '@angular/router';

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
      useValue: builInErrors,
    },
  ],
})
export class RegistrationPageComponent {
  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  private readonly destroy = inject(DestroyRef);

  private isSubmitted = false;

  registrationForm: FormGroup = this.fb.group({
    email: this.fb.control(''),
    password: this.fb.control(''),
    confirmPassword: this.fb.control(''),
    name: this.fb.control(''),
    lastName: this.fb.control(''),
  });

  handleSignup() {
    this.isSubmitted = true;
    this.registrationForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.registrationForm.get('email')?.updateValueAndValidity();
    this.registrationForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.registrationForm.get('password')?.updateValueAndValidity();
    this.registrationForm.setValidators([matchPasswordsValidator('password', 'confirmPassword')]);

    this.registrationForm.markAllAsTouched();

    if (!this.registrationForm.valid) {
      return;
    }

    const body = this.registrationForm.value;
    this.authService.signup(body);
  }

  protected checkSubmitStatus() {
    if (this.isSubmitted) {
      return this.registrationForm.invalid;
    }
    return this.registrationForm.pristine;
  }
}
