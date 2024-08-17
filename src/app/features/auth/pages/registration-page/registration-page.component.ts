import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AuthService } from '@features/auth/services/auth.service';
import { errors } from '@shared/constants/built-in-errors.constant';
import { matchPasswordsValidator, passwordValidator } from '@features/auth/utils/password.validator';
import { emailValidator } from '@features/auth/utils/email.validator';

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
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: errors,
    },
  ],
})
export class RegistrationPageComponent {
  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  public formSubmitted = false;

  public hasClickedSubmit = false;

  registrationForm = this.fb.group(
    {
      email: this.fb.control('', [Validators.required, emailValidator]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8), passwordValidator]),
      confirmPassword: this.fb.control('', [Validators.required]),
      name: this.fb.control('', [Validators.required]),
      lastName: this.fb.control(''),
    },
    { validator: matchPasswordsValidator('password', 'confirmPassword') }
  );

  signup() {
    this.formSubmitted = true;
    this.hasClickedSubmit = true;
    this.registrationForm.markAllAsTouched();

    if (!this.registrationForm.valid) {
      return;
    }
    const body = this.registrationForm.value;
    this.authService.signup(body);
  }
}
