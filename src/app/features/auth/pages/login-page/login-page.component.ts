import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { emailValidator, passwordValidator } from '@features/auth/validators';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { TuiValidator } from '@taiga-ui/cdk';

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
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private isSubmitted = false;

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });

  protected onSubmit() {
    this.isSubmitted = true;
    this.form.get('email')?.setValidators([Validators.required, emailValidator()]);
    this.form.get('email')?.updateValueAndValidity();
    this.form.get('password')?.setValidators([Validators.required, passwordValidator()]);
    this.form.get('password')?.updateValueAndValidity();
    this.form.markAllAsTouched();
    const body = this.form.value;
    this.authService.signin(body);
  }

  protected checkSubmitStatus() {
    if (this.isSubmitted) {
      return this.form.invalid;
    }
    return this.form.pristine;
  }
}
