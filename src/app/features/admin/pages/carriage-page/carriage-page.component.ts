import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageCardComponent } from '@features/admin/components/carriage-card/carriage-card.component';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [CarriagePreviewComponent, CarriageFormComponent, CarriageCardComponent, TuiButton],
  templateUrl: './carriage-page.component.html',
  styleUrl: './carriage-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePageComponent {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public readonly showForm = signal(false);

  private readonly _carriages = signal<Carriage[]>([]);

  public readonly carriages = this._carriages.asReadonly();

  public newCarriages = signal<Carriage[]>([]);

  public allCarriages = computed(() => [...this.newCarriages(), ...this._carriages()]);

  public selectedCarriage: Carriage | null = null;

  public constructor() {
    this.loadCarriages()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (carriages) => {
          this._carriages.set(carriages);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public loadCarriages() {
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

  public onCancel() {
    this.showForm.set(false);
  }

  public createCarriage(carriageData: Carriage) {
    const isCarriage = this._carriages().some((item) => item.code === carriageData.name);
    const isCarriageNew = this.newCarriages().some((item) => item.code === carriageData.name);
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
        switchMap(() => this.loadCarriages()),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (carriages) => {
          this._carriages.set(carriages);
          this.showForm.set(false);
          this.newCarriages.set([]);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
