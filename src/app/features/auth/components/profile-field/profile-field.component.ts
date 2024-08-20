import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { emailValidator } from '@features/auth/validators';

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

  public text = input<string | null>();

  private readonly fb = inject(FormBuilder);

  private readonly profileService = inject(ProfileService);

  private readonly destroy = inject(DestroyRef);

  protected isEditMode = signal(false);

  public profileForm = this.fb.group({
    text: this.fb.control('', [Validators.required]),
  });

  public constructor() {
    effect(() => {
      if (this.text()) {
        this.profileForm.patchValue({ text: this.text() ?? '' });
      }
      if (this.label() === 'email') {
        this.profileForm.get('text')?.setValidators([Validators.required, emailValidator()]);
      }
    });
  }

  protected switchEditMode() {
    this.isEditMode.set(true);
  }

  protected save() {
    tuiMarkControlAsTouchedAndValidate(this.profileForm);
    const { text } = this.profileForm.value;

    if (this.profileForm.valid && text) {
      this.profileService
        .updateUserInformation(this.label(), text)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe(() => {
          this.isEditMode.set(false);
        });
    }
  }
}
