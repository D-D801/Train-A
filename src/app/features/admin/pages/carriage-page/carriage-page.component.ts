import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

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

  protected readonly showForm = signal(false);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly carriages = signal<Carriage[]>([]);

  public newCarriages = signal<Carriage[]>([]);

  public selectedCarriage: Carriage | null = null;

  public allCarriages = computed(() => [...this.newCarriages(), ...this.carriages()]);

  public constructor() {
    this.loadCarriages()
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

  private loadCarriages() {
    return this.carriageApiService.getCarriages();
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
      this.updateCarriage(carriageData);
    } else {
      this.createCarriage(carriageData);
    }
  }

  public createCarriage(carriageData: Carriage) {
    const isCarriage = this.carriages().some((item) => item.name === carriageData.name);
    const isCarriageNew = this.newCarriages().some((item) => item.name === carriageData.name);
    if (isCarriage || isCarriageNew) {
      this.alert.open({ message: 'Carriage already exists', label: 'Error', appearance: 'error' });
      return;
    }
    this.carriageApiService
      .createCarriage(carriageData)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: ({ code }) => {
          this.showForm.set(false);
          const car = { ...carriageData, code };
          this.newCarriages.update((newCarriages) => {
            return [car, ...newCarriages];
          });
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public updateCarriage(carriageData: Carriage) {
    this.carriageApiService
      .updateCarriage(carriageData)
      .pipe(
        takeUntilDestroyed(this.destroy),
        switchMap(() => this.loadCarriages())
      )
      .subscribe({
        next: (carriages) => {
          this.carriages.set(carriages);
          this.showForm.set(false);
          this.newCarriages.set([]);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public onCancel() {
    this.showForm.set(false);
  }
}
