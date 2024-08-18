import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { builtInErrors } from '@shared/constants/build-in-errors.constants';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
      useValue: builtInErrors,
    },
  ],
})
export class ProfileFieldComponent implements OnChanges {
  @Input({ required: true }) label!: 'name' | 'email';

  @Input({ required: true }) text!: string | null;

  private readonly fb = inject(FormBuilder);

  private readonly profileService = inject(ProfileService);

  private readonly destroy = inject(DestroyRef);

  protected isEditMode = false;

  public profileForm = this.fb.group({
    text: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && changes['text'].currentValue !== changes['text'].previousValue) {
      this.profileForm.patchValue({ text: this.text });
    }
    if (changes['label'] && changes['label'].currentValue === 'email') {
      this.profileForm.get('text')?.setValidators([Validators.required, emailValidator()]);
    }
  }

  protected switchEditMode() {
    this.isEditMode = true;
  }

  protected save() {
    tuiMarkControlAsTouchedAndValidate(this.profileForm);
    const { text } = this.profileForm.value;

    if (this.profileForm.valid && text) {
      this.profileService.updateUserInformation(this.label, text).pipe(takeUntilDestroyed(this.destroy)).subscribe();
      this.isEditMode = false;
    }
  }
}
