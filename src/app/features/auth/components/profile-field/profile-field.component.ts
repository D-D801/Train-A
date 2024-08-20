import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { emailValidator } from '@features/auth/validators';
import { AlertService } from '@core/services/alert/alert.service';
import { ProfileApiService } from '@features/auth/services/profile-api/profile-api.service';

@Component({
  selector: 'dd-profile-field',
  standalone: true,
  imports: [
    TuiInputInline,
    TuiButton,
    NgIf,
    TuiAutoFocus,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    TuiError,
    AsyncPipe,
    TuiInputModule,
  ],
  templateUrl: './profile-field.component.html',
  styleUrl: './profile-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
})
export class ProfileFieldComponent {
  public label = input.required<'name' | 'email'>();

  public profileFieldValue = input<string | null>();

  private readonly profileApiService = inject(ProfileApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly fb = inject(FormBuilder);

  protected isEditMode = signal(false);

  public profileForm = this.fb.group({
    text: this.fb.control('', [Validators.required]),
  });

  public constructor() {
    effect(() => {
      if (this.profileFieldValue()) {
        this.profileForm.patchValue({ text: this.profileFieldValue() ?? '' });
      }
      if (this.label() === 'email') {
        this.profileForm.get('text')?.setValidators([Validators.required, emailValidator()]);
      }
    });
  }

  protected enableEditMode() {
    this.isEditMode.set(true);
  }

  protected saveProfileField() {
    tuiMarkControlAsTouchedAndValidate(this.profileForm);
    const { text } = this.profileForm.value;

    if (this.profileForm.valid && text) {
      this.profileApiService
        .updateUserInformation({ [this.label()]: text })
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: () => {
            this.alert.open({ message: text, label: `Change ${this.label()}` });
            this.isEditMode.set(false);
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    }
  }
}
