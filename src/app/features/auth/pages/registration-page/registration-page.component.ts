import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AuthService } from '@features/auth/services/auth.service';
import { errors } from '@shared/constants/built-in-errors.constant';
import { matchPasswordsValidator } from '@features/auth/utils/password.validator';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class RegistrationPageComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  private readonly destroy = inject(DestroyRef);

  public showErrors = false;

  public firstClickButton = false;

  public disabledButton = false;

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

  ngOnInit() {
    this.resetTouchedOnEmptyFields();
  }

  resetTouchedOnEmptyFields() {
    this.registrationForm.statusChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (this.registrationForm.controls['email'].valid && this.registrationForm.controls['password'].valid) {
        this.disabledButton = false;
      } else if (this.firstClickButton) {
        this.disabledButton = true;
      }
    });
  }

  handleSignup() {
    this.showErrors = true;

    this.firstClickButton = true;

    this.registrationForm.markAllAsTouched();

    if (!this.registrationForm.valid) {
      this.disabledButton = true;
      return;
    }

    const body = this.registrationForm.value;
    this.authService.signup(body);
  }
}
