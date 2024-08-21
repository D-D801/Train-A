import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [CarriagePreviewComponent, CarriageFormComponent, NgFor, NgIf, TuiButton],
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

  // private readonly carriages$ = this.carriageApiService.getCarriages();

  public carriages = toSignal(this.carriages$, { initialValue: [] });

  public selectedCarriage: Carriage | null = null;

  public onCreate() {
    this.selectedCarriage = null;
    this.showForm = true;
  }

  public onEdit(carriage: Carriage) {
    this.selectedCarriage = carriage;
    this.showForm = true;
  }

  public onSubmit(carriageData: Carriage) {
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

  public afterSave() {
    this.showForm = false;
    this.refreshTrigger.next();
  }

  public onCancel() {
    this.showForm = false;
  }
}
