import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { emailValidator } from '@features/auth/validators';
import { AlertService } from '@core/services/alert/alert.service';
import { ProfileApiService } from '@features/auth/services/profile-api/profile-api.service';
import { TextSwitchFormComponent } from '../../../../shared/components/text-switch-form/text-switch-form.component';

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
    TextSwitchFormComponent,
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

  public profileForm = this.fb.group({
    profileFieldValue: this.fb.control('', [Validators.required]),
  });

  public onSave = () => this.saveProfileField(this.profileForm);

  public constructor() {
    effect(() => {
      if (this.profileFieldValue()) {
        this.profileForm.patchValue({ profileFieldValue: this.profileFieldValue() ?? '' });
      }
      if (this.label() === 'email') {
        this.profileForm.controls.profileFieldValue.setValidators([Validators.required, emailValidator()]);
      }
    });
  }

  protected saveProfileField(
    form: FormGroup<{
      profileFieldValue: FormControl<string | null>;
    }>
  ) {
    tuiMarkControlAsTouchedAndValidate(form);
    const { profileFieldValue } = form.value;

    if (form.valid && profileFieldValue) {
      this.profileApiService
        .updateUserInformation({ [this.label()]: profileFieldValue })
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: () => {
            this.alert.open({ message: profileFieldValue, label: `Change ${this.label()}` });
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    }
  }
}
