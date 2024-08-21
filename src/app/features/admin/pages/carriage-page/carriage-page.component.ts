import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './carriage-page.component.html',
  styleUrl: './carriage-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePageComponent {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly fb = inject(FormBuilder);

  protected showForm: boolean = false;

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly refreshTrigger = new BehaviorSubject<void>(undefined);

  private readonly carriages$ = this.refreshTrigger.pipe(switchMap(() => this.carriageApiService.getCarriages()));

  public carriages = toSignal(this.carriages$, { initialValue: [] });

  public carriageForm = this.fb.group({
    code: [''],
    name: [''],
    rows: [0],
    leftSeats: [0],
    rightSeats: [0],
  });

  public onCreate() {
    this.showForm = true;
    this.carriageForm.reset();
  }

  public onEdit(carriage: Carriage) {
    this.showForm = true;
    this.carriageForm.patchValue(carriage);
  }

  public onSubmit() {
    if (this.carriageForm.valid) {
      const carriageData = this.carriageForm.value;
      if (carriageData.code) {
        this.carriageApiService
          .updateCarriage(carriageData)
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe({
            next: () => {
              this.afterSave();
            },
            error: ({ error: { message } }) => {
              this.alert.open({ message, label: 'Error', appearance: 'error' });
            },
          });
      } else {
        this.carriageApiService
          .createCarriage(carriageData)
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe({
            next: () => {
              this.afterSave();
            },
            error: ({ error: { message } }) => {
              this.alert.open({ message, label: 'Error', appearance: 'error' });
            },
          });
      }
    }
  }

  public afterSave() {
    this.showForm = false;
    this.refreshTrigger.next();
  }

  public onCancel() {
    this.showForm = false;
  }
}
