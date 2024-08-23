import { NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, input, effect } from '@angular/core';
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
    TuiButton,
    AsyncPipe,
    TuiInputModule,
    TuiInputNumberModule,
  ],
  templateUrl: './carriage-form.component.html',
  styleUrl: './carriage-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageFormComponent {
  public carriage = input.required<Carriage | null>();

  @Output() public submitForm = new EventEmitter<Carriage>();

  @Output() public cancelForm = new EventEmitter<null>();

  private readonly fb = inject(NonNullableFormBuilder);

  protected min = 1;

  public carriageForm = this.fb.group({
    code: this.fb.control(''),
    name: this.fb.control('', Validators.required),
    rows: this.fb.control(1, Validators.required),
    leftSeats: this.fb.control(1, Validators.required),
    rightSeats: this.fb.control(1, Validators.required),
  });

  public constructor() {
    effect(() => {
      const carriage = this.carriage();
      if (carriage) {
        const { name, rows, leftSeats, rightSeats } = carriage;
        this.carriageForm.patchValue({ name, rows, leftSeats, rightSeats });
      }
    });
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
