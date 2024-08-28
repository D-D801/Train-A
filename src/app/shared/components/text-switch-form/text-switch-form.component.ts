import { AsyncPipe, KeyValuePipe, NgFor, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, tuiDateFormatProvider, TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import {
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { take } from 'rxjs';

@Component({
  selector: 'dd-text-switch-form',
  standalone: true,
  imports: [
    TuiInputInline,
    TuiButton,
    TuiAutoFocus,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    TuiError,
    AsyncPipe,
    TuiInputModule,
    NgSwitch,
    NgSwitchCase,
    NgFor,
    KeyValuePipe,
    TitleCasePipe,
    TuiInputDateTimeModule,
    TuiCurrencyPipe,
    TuiTextfieldControllerModule,
    TuiInputNumberModule,
  ],
  templateUrl: './text-switch-form.component.html',
  styleUrl: './text-switch-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [tuiDateFormatProvider({ mode: 'DMY' })],
})
export class TextSwitchFormComponent implements OnInit {
  public form = input.required<FormGroup>();

  public typeInputs = input.required<string>();

  public onSave = input.required<() => void>();

  private readonly destroy = inject(DestroyRef);

  public cdr = inject(ChangeDetectorRef);

  public isEditMode = false;

  public ngOnInit(): void {
    const formGroup = this.form();

    if (formGroup) {
      formGroup.valueChanges.pipe(take(1), takeUntilDestroyed(this.destroy)).subscribe(() => {
        this.cdr.markForCheck();
      });
    }
  }

  public enableEditMode() {
    this.isEditMode = true;
  }

  public save() {
    if (this.form().valid) {
      this.onSave()();
      this.isEditMode = false;
    }
  }
}
