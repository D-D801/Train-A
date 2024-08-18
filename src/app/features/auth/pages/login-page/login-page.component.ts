import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  public isSubmitted = false;

  private fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: [''],
    password: [''],
  });

  public onSubmit() {
    const emailControl = this.form.get('email');
    const passwordControl = this.form.get('password');

    this.isSubmitted = true;
    emailControl?.setValidators([Validators.required, emailValidator()]);
    emailControl?.updateValueAndValidity();
    passwordControl?.setValidators([Validators.required, passwordValidator()]);
    passwordControl?.updateValueAndValidity();
    this.form.markAllAsTouched();
    const body = this.form.value;
    this.authService.signin(body).pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }

  public checkSubmitStatus() {
    return this.isSubmitted ? this.form.invalid : this.form.pristine;
  }
}
