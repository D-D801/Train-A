import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate, tuiTakeUntilDestroyed } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { builtInErrors } from '@shared/constants/build-in-errors.constants';

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
  @Input({ required: true }) label!: string;

  @Input({ required: true }) text!: string;

  private readonly alert = inject(TuiAlertService);

  private readonly fb = inject(FormBuilder);

  private readonly destroy = inject(DestroyRef);

  protected isEditMode = false;

  public profileForm = this.fb.group({
    text: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && changes['text'].currentValue !== changes['text'].previousValue) {
      this.profileForm.patchValue({ text: this.text });
    }
    if (changes['label'] && changes['label'].currentValue === 'Email') {
      this.profileForm.get('text')?.setValidators([Validators.required, Validators.email]);
    }
  }

  protected switchEditMode() {
    this.isEditMode = true;
  }

  protected save() {
    tuiMarkControlAsTouchedAndValidate(this.profileForm);
    if (this.profileForm.valid) {
      this.isEditMode = false;
      this.alert
        .open(this.profileForm.value.text, { label: `New ${this.label.toLowerCase()}` })
        .pipe(tuiTakeUntilDestroyed(this.destroy))
        .subscribe();
    }
  }
}
