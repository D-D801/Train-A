import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageFormComponent } from '@features/admin/components/carriage-form/carriage-form.component';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { TuiButton } from '@taiga-ui/core';
import { BehaviorSubject, combineLatest, map, Subject } from 'rxjs';

@Component({
  selector: 'dd-carriage-page',
  standalone: true,
  imports: [CarriagePreviewComponent, CarriageFormComponent, NgFor, NgIf, TuiButton, AsyncPipe],
  templateUrl: './carriage-page.component.html',
  styleUrl: './carriage-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePageComponent implements OnInit {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly fb = inject(FormBuilder);

  protected showForm = signal(false);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly refreshTrigger = new Subject<void>();

  public readonly carriages$ = this.carriageApiService.getCarriages();

  public selectedCarriage: Carriage | null = null;

  private readonly newCarriages$ = new BehaviorSubject<Carriage[]>([]);

  public readonly newCarriages$$ = this.newCarriages$.asObservable();

  public ngOnInit() {
    this.refreshTrigger.next();
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
            this.afterSave(carriageData);
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
            this.afterSave(carriageData);
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    }
  }

  public afterSave(newCarriage: Carriage) {
    this.showForm.set(false);
    const currentNewCarriages = this.newCarriages$.getValue();
    this.newCarriages$.next([newCarriage, ...currentNewCarriages]);
  }

  public onCancel() {
    this.showForm.set(false);
  }

  public readonly combinedCarriages$ = combineLatest([this.carriages$, this.newCarriages$$]).pipe(
    map(([carriagesFromApi, newCarriages$$]) => [...newCarriages$$, ...carriagesFromApi])
  );
}
