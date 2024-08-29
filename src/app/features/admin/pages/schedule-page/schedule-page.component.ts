import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Route } from '@features/admin/interfaces/route.interface';
import { RideApiService } from '@features/admin/services/ride-api/ride-api.service';
import { RideService } from '@features/admin/services/ride/ride.service';
import { RideCardComponent } from '../../components/ride-card/ride-card.component';
import { NewRideFormComponent } from '../../components/new-ride-form/new-ride-form.component';

@Component({
  selector: 'dd-schedule-page',
  standalone: true,
  imports: [TuiButton, RideCardComponent, AsyncPipe, NgFor, NewRideFormComponent],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {
  // TODO: change to input
  protected routeId = 13;

  private readonly routeApiService = inject(RouteApiService);

  protected readonly rideService = inject(RideService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  protected routeInformation = signal<Route>({} as Route);

  protected carriages = signal<string[]>([]);

  public constructor() {
    this.routeApiService
      .getRoute(this.routeId)
      .pipe(
        tap({
          next: (route) => {
            const currentCarriages = new Set<string>(route.carriages);
            this.carriages.set([...currentCarriages]);

            this.routeInformation.set(route);
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  protected deleteRide(rideId: number): void {
    this.routeInformation.update((routeInfo) => ({
      ...routeInfo,
      schedule: routeInfo.schedule.filter((ride) => ride.rideId !== rideId),
    }));
  }
}
