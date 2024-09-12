import { NgFor, AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, effect, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiError, TuiButton } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiInputNumberModule } from '@taiga-ui/legacy';
import { Carriage } from '@shared/interfaces/carriage.interface';
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
    NgTemplateOutlet,
  ],
  templateUrl: './carriage-form.component.html',
  styleUrl: './carriage-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageFormComponent {
  public carriage = input.required<Carriage | null>();

  public submitForm = output<Carriage>();

  public cancelForm = output<null>();

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
        const { code, name, rows, leftSeats, rightSeats } = carriage;
        this.carriageForm.patchValue({ code, name, rows, leftSeats, rightSeats });
      } else {
        this.carriageForm.patchValue({ code: '', name: '', rows: 1, leftSeats: 1, rightSeats: 1 });
      }
    });
  }

  public onSubmit() {
    const { code, name, rows, leftSeats, rightSeats } = this.carriageForm.value;
    if (!(name && rows && leftSeats && rightSeats)) return;
    this.submitForm.emit({ code: code ?? '', name, rows, leftSeats, rightSeats });
  }

  public onCancel() {
    this.cancelForm.emit(null);
  }
}
