import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriagesService } from '@core/services/carriages/carriages.service';
import { CarriageCardComponent } from '@features/admin/components/carriage-card/carriage-card.component';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [CarriagePreviewComponent, CarriageFormComponent, CarriageCardComponent, TuiButton],
  templateUrl: './carriages-page.component.html',
  styleUrl: './carriages-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesPageComponent {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly carriagesService = inject(CarriagesService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public readonly showForm = signal(false);

  public readonly carriages = this.carriagesService.carriages;

  public newCarriages = signal<Carriage[]>([]);

  public allCarriages = computed(() => [...this.newCarriages(), ...this.carriages()]);

  public selectedCarriage: Carriage | null = null;

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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
    if (!this.checkNameCarriage(carriageData)) return;

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
    if (!this.checkNameCarriage(carriageData)) return;

    this.carriagesService
      .updateCarriage(carriageData)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.showForm.set(false);
          this.newCarriages.set([]);
        },
      });
  }

  private checkNameCarriage(carriageData: Carriage) {
    const isCarriage = this.carriages().some(
      (item) => item.code === carriageData.name || item.name === carriageData.name
    );
    const isCarriageNew = this.newCarriages().some(
      (item) => item.code === carriageData.name || item.name === carriageData.name
    );

    if (isCarriage || isCarriageNew) {
      this.alert.open({ message: 'Carriage already exists', label: 'Error', appearance: 'error' });
      return false;
    }
    return true;
  }
}
