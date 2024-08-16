import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/legacy';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'dd-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  registrationForm = this.fb.group({
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    confirmPassword: this.fb.control('', [Validators.required]),
    name: this.fb.control('', [Validators.required]),
    lastName: this.fb.control(''),
  });

  signup() {
    if (!this.registrationForm.valid) return;
    const body = this.registrationForm.value;
    this.authService.signup(body);
  }
}
