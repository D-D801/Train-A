import { AsyncPipe, KeyValuePipe, NgFor, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateTimeTransformerService } from '@features/admin/services/date-time-transformer/date-time-transformer.service';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TUI_DATE_TIME_VALUE_TRANSFORMER, TuiFieldErrorPipe, TuiInputInline } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'dd-text-switch-form',
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
    NgSwitch,
    NgSwitchCase,
    NgFor,
    KeyValuePipe,
    TitleCasePipe,
    TuiInputDateTimeModule,
  ],
  templateUrl: './text-switch-form.component.html',
  styleUrl: './text-switch-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_DATE_TIME_VALUE_TRANSFORMER,
      useClass: DateTimeTransformerService,
    },
  ],
})
export class TextSwitchFormComponent {
  public form = input.required<FormGroup>();

  public typeInputs = input.required<string>();

  public onSave = input.required<() => void>();

  public cdr = inject(ChangeDetectorRef);

  public isEditMode = false;

  public constructor() {
    effect(() => {
      const formGroup = this.form();

      if (formGroup) {
        formGroup.valueChanges.subscribe(() => {
          this.cdr.markForCheck();
        });
      }
    });
  }

  public enableEditMode(): void {
    this.isEditMode = true;
  }

  public save(): void {
    if (this.form().valid) {
      this.onSave()();
      this.isEditMode = false;
    }
  }
}
