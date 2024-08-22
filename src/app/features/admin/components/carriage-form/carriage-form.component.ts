import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { TuiError, TuiButton } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiInputNumberModule } from '@taiga-ui/legacy';
import { CarriagePreviewComponent } from '../carriage-preview/carriage-preview.component';

@Component({
  selector: 'dd-carriage-form',
  standalone: true,
  imports: [
    CarriagePreviewComponent,
    TuiError,
    ReactiveFormsModule,
    TuiFieldErrorPipe,
    NgFor,
    NgIf,
    TuiButton,
    AsyncPipe,
    TuiInputModule,
    TuiInputNumberModule,
  ],
  templateUrl: './carriage-form.component.html',
  styleUrl: './carriage-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageFormComponent implements OnChanges {
  private readonly fb = inject(NonNullableFormBuilder);

  protected min = 1;

  public carriageForm = this.fb.group({
    code: [''],
    name: ['', Validators.required],
    rows: [1, Validators.required],
    leftSeats: [1, Validators.required],
    rightSeats: [1, Validators.required],
  });

  @Input() public carriage: Carriage | null = null;

  @Output() public submitForm = new EventEmitter<Carriage>();

  @Output() public cancelForm = new EventEmitter<null>();

  public ngOnChanges() {
    if (this.carriage) {
      this.carriageForm.patchValue(this.carriage);
    }
  }

  public onSubmit() {
    const { code, name, rows, leftSeats, rightSeats } = this.carriageForm.value;
    if (!(name && rows && leftSeats && rightSeats)) return;
    this.submitForm.emit({ code, name, rows, leftSeats, rightSeats });
  }

  public onCancel() {
    this.cancelForm.emit(null);
  }
}
