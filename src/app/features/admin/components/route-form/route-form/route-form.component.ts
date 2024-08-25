import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { Station } from '@features/admin/interfaces/station.interface';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiDataList, TuiSurface } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { map } from 'rxjs';

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
  ],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteFormComponent {
  private readonly routeApiService = inject(RouteApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);

  private readonly cdr = inject(ChangeDetectorRef);

  public trainRoute = input.required<TrainRoute>();

  protected readonly connectedToStations = signal<number[][]>([]);

  protected stations = signal<Station[]>([]);

  protected carriages = signal<string[]>([]);

  public form = this.fb.group({
    stations: this.fb.array([]),
    carriages: this.fb.array([]),
  });

  public constructor() {
    this.routeApiService
      .getCarriages()
      .pipe(
        map((data) => data.map((carriage) => carriage.name)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe((carriages) => {
        this.carriages.set(carriages);
      });
    this.routeApiService.getStations().subscribe((data) => {
      this.stations.set(data);
      this.getBlaBla(this.trainRoute().path);
    });
    effect(() => {
      this.trainRoute().path.forEach((station) => this.form.controls.stations.push(this.fb.control(station)));
      this.trainRoute().carriages.forEach((carriage) => this.form.controls.carriages.push(this.fb.control(carriage)));
      this.cdr.detectChanges();
    });

    this.form.controls.stations.valueChanges.subscribe((data) => {
      this.getBlaBla(data as number[]);
    });
  }

  public getBlaBla(data: number[]) {
    const tmp = data.map((stationId, index, array) => {
      const prevStation = index > 0 ? array[index - 1] : null;
      const nextStation = index < array.length - 1 ? array[index + 1] : null;

      const prevStationConnect = prevStation ? this.stations()[prevStation - 1]?.connectedTo || [] : [];
      const nextStationConnect = nextStation ? this.stations()[nextStation - 1]?.connectedTo || [] : [];

      if (index === 0) return nextStationConnect;
      if (index === array.length - 1) return prevStationConnect;

      return prevStationConnect.filter((connectStation) =>
        nextStationConnect.some((nextSt) => nextSt.id === connectStation.id && nextSt.id !== stationId)
      );
    });

    const tmp2 = tmp.map((item) => item.map((item2) => item2.id));

    this.connectedToStations.set(tmp2);
  }
}
