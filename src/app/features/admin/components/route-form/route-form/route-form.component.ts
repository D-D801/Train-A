import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { Station } from '@features/admin/interfaces/station.interface';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { MIN_ROUTE_FORM_CONTROL_COUNT } from '@features/admin/constants/min-route-control-count';
import { updateAvailableStations } from '@features/admin/utils/update-available-stations';
import { TuiButton, TuiDataList, TuiIcon, TuiLoader, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { map } from 'rxjs';

enum ControlsType {
  path = 'path',
  carriages = 'carriages',
}

@Component({
  selector: 'dd-route-form',
  standalone: true,
  imports: [
    RouteCardComponent,
    TuiCardLarge,
    TuiSurface,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    NgForOf,
    TuiDataList,
    TuiAvatar,
    TuiButton,
    TuiIcon,
    TuiHeader,
    TuiTitle,
    TuiLoader,
  ],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteFormComponent {
  public readonly trainRoute = input<TrainRoute>();

  public save = output();

  private readonly alert = inject(AlertService);

  private readonly routeApiService = inject(RouteApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);

  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly connectedToStations = signal<string[][]>([]);

  protected readonly stations = signal<Station[]>([]);

  protected readonly carriages = signal<string[]>([]);

  protected readonly ControlsType = ControlsType;

  public form = this.fb.group({
    path: this.fb.array<FormControl<string>>([]),
    carriages: this.fb.array<FormControl<string>>([]),
  });

  public constructor() {
    this.routeApiService
      .getCarriages()
      .pipe(
        map((data) => data.map((carriage) => carriage.name)),
        takeUntilDestroyed()
      )
      .subscribe((carriages) => {
        this.carriages.set(carriages);
      });

    this.routeApiService
      .getStations()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.stations.set(data);
        const availableStations = this.trainRoute()
          ? updateAvailableStations(this.trainRoute()?.path || [], this.stations())
          : updateAvailableStations(new Array(MIN_ROUTE_FORM_CONTROL_COUNT).fill(null), this.stations());

        this.connectedToStations.set(availableStations);
      });

    effect(() => {
      if (this.trainRoute()) {
        this.form.controls.path.clear();
        this.form.controls.carriages.clear();
        this.trainRoute()?.path.forEach((stationId) =>
          this.form.controls.path.push(this.fb.control(this.getCityNameById(stationId) ?? '', Validators.required))
        );
        this.trainRoute()?.carriages.forEach((carriage) =>
          this.form.controls.carriages.push(this.fb.control(carriage))
        );
      } else {
        this.addInitialControls(ControlsType.path);
        this.addInitialControls(ControlsType.carriages);
      }
      this.cdr.detectChanges();
    });

    this.form.controls.path.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      const availableStations = updateAvailableStations(this.getCityIds(), this.stations());
      this.connectedToStations.set(availableStations);
    });
  }

  private getCityNameById(cityId: number) {
    return this.stations().find((station) => station.id === cityId)?.city;
  }

  private getCityIds() {
    return this.form.controls.path.value.map(
      (city) => this.stations().find((station) => station.city === city)?.id ?? null
    );
  }

  public addControl(controlsType: ControlsType) {
    if (controlsType === ControlsType.path) {
      this.form.controls.path.push(this.fb.control('', [Validators.required]));
    } else {
      this.form.controls.carriages.push(this.fb.control('', [Validators.required]));
    }
  }

  public removeControl(controlsType: ControlsType) {
    if (controlsType === ControlsType.path) {
      this.form.controls.path.removeAt(this.form.controls.path.length - 1);
    } else {
      this.form.controls.carriages.removeAt(this.form.controls.carriages.length - 1);
    }
  }

  public resetStations(controlsType: ControlsType) {
    if (controlsType === ControlsType.path) {
      this.form.controls.path.clear();
      this.addInitialControls(ControlsType.path);
    } else {
      this.form.controls.carriages.clear();
      this.addInitialControls(ControlsType.carriages);
    }
  }

  private addInitialControls(controlsType: ControlsType) {
    for (let i = 0; i < MIN_ROUTE_FORM_CONTROL_COUNT; i += 1) {
      if (controlsType === ControlsType.path) {
        this.form.controls.path.push(this.fb.control('', [Validators.required]));
      } else {
        this.form.controls.carriages.push(this.fb.control('', [Validators.required]));
      }
    }
  }

  public onSubmit() {
    const { carriages } = this.form.value;
    const cityIds = this.getCityIds();
    const route = this.trainRoute();

    if (!carriages) return;
    if (cityIds.some((cityId) => cityId == null)) return;

    if (route) {
      this.routeApiService
        .updateRoute({ carriages, path: cityIds as number[], id: route.id })
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            this.save.emit();
            this.alert.open({
              message: `Route ${data.id} successfully updated.`,
              label: 'Success',
              appearance: 'success',
            });
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    } else {
      this.routeApiService
        .createRoute({ carriages, path: cityIds as number[] })
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            this.save.emit();
            this.alert.open({
              message: `Route ${data.id} successfully created.`,
              label: 'Success',
              appearance: 'success',
            });
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        });
    }
  }
}