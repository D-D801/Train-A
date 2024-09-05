import { AsyncPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CURRENCY } from '@shared/constants/currency';
import { getCurrentDateTime } from '@shared/utils/getCurrentDateTime';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, tuiDateFormatProvider, TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import {
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'dd-editable-form',
  standalone: true,
  imports: [
    TuiButton,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    TuiError,
    AsyncPipe,
    TuiInputModule,
    KeyValuePipe,
    TitleCasePipe,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    TuiCurrencyPipe,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './editable-form.component.html',
  styleUrl: './editable-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [tuiDateFormatProvider({ mode: 'DMY' })],
})
export class EditableFormComponent implements OnInit {
  public form = input.required<FormGroup>();

  public typeInputs = input.required<'text' | 'date-time' | 'price'>();

  public save = input.required<Observable<boolean> | null>();

  private readonly destroy = inject(DestroyRef);

  private readonly cdr = inject(ChangeDetectorRef);

  protected isPrice = computed(() => (this.typeInputs() === 'price' ? this.currency : ''));

  protected isEditMode = signal(false);

  protected minDate = getCurrentDateTime();

  protected currency = CURRENCY;

  public ngOnInit(): void {
    const formGroup = this.form();

    if (formGroup) {
      formGroup.valueChanges.pipe(take(1), takeUntilDestroyed(this.destroy)).subscribe(() => {
        this.cdr.markForCheck();
      });
    }
  }

  protected enableEditMode() {
    this.isEditMode.set(true);
  }

  protected saveForm() {
    if (this.form().valid) {
      this.save()
        ?.pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (res) => {
            this.isEditMode.set(!res);
          },
        });
    }
  }
}
