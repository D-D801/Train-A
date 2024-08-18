import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { builInErrors } from '@shared/constants/built-in-errors.constant';
import { matchPasswordsValidator, passwordValidator } from '@features/auth/validators/password.validator';
import { RouterLink } from '@angular/router';
import { emailValidator } from '@features/auth/validators/email.validator';
import { AuthService } from '@features/auth/services/auth/auth.service';

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
  });

  onSubmit() {
    const emailControl = this.registrationForm.get('email');
    const passwordControl = this.registrationForm.get('password');

    this.isSubmitted = true;
    emailControl?.setValidators([Validators.required, emailValidator()]);
    emailControl?.updateValueAndValidity();
    passwordControl?.setValidators([Validators.required, passwordValidator()]);
    passwordControl?.updateValueAndValidity();
    this.registrationForm.setValidators([matchPasswordsValidator('password', 'confirmPassword')]);

    this.registrationForm.markAllAsTouched();

    if (!this.registrationForm.valid) {
      return;
    }

    const body = this.registrationForm.value;
    this.authService.signup(body);
  }

  protected checkSubmitStatus() {
    return this.isSubmitted ? this.registrationForm.invalid : this.registrationForm.pristine;
  }
}
