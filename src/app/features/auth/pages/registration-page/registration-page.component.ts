import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AuthService } from '@features/auth/services/auth.service';
import { errors } from '@shared/constants/built-in-errors.constant';
import { matchPasswordsValidator } from '@features/auth/utils/password.validator';
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
      useValue: errors,
    },
  ],
})
export class RegistrationPageComponent {
  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  public isDisabledRegister = true;

  registrationForm = this.fb.group(
    {
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control('', [Validators.required]),
      name: this.fb.control(''),
      lastName: this.fb.control(''),
    },
    { validator: matchPasswordsValidator('password', 'confirmPassword') }
  );

  signup() {
    if (!this.registrationForm.valid) {
      return;
    }
    const body = this.registrationForm.value;
    this.authService.signup(body);
  }
}
