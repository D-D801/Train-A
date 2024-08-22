import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [CarriagePreviewComponent, CarriageFormComponent, TuiButton],
  templateUrl: './carriage-page.component.html',
  styleUrl: './carriage-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePageComponent {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly fb = inject(FormBuilder);

  protected readonly showForm = signal(false);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  // public carriages = toSignal(this.carriageApiService.getCarriages(), { initialValue: [] });
  private readonly carriages = signal<Carriage[]>([]);

  public newCarriages = signal<Carriage[]>([]);

  public selectedCarriage: Carriage | null = null;

  public allCarriages = computed(() => [...this.newCarriages(), ...this.carriages()]);

  public constructor() {
    this.loadCarriages();
  }

  private loadCarriages() {
    this.carriageApiService
      .getCarriages()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (carriages) => {
          this.carriages.set(carriages);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public onCreate() {
    this.selectedCarriage = null;
    this.showForm.set(true);
  }

  public onEdit(carriage: Carriage) {
    this.selectedCarriage = carriage;
    this.showForm.set(true);
  }

  public onSubmit(carriageData: Carriage) {
    if (carriageData.code) {
      this.carriageApiService
        .updateCarriage(carriageData)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: () => {
            this.showForm.set(false);
            this.loadCarriages();
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
            this.showForm.set(false);
            this.newCarriages.update((newCarriages) => {
              return [carriageData, ...newCarriages];
            });
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    }
  }

  public onCancel() {
    this.showForm.set(false);
  }
}
