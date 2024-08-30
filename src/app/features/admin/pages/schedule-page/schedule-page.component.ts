import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Route } from '@features/admin/interfaces/route.interface';
import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
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
  // TODO: change to query
  protected routeId = 4;

  private readonly routeApiService = inject(RouteApiService);

  protected readonly newRideService = inject(NewRideService);

  private readonly alert = inject(AlertService);

  protected routeInformation = signal<Route>({} as Route);

  protected carriages = signal<string[]>([]);

  public constructor() {
    this.routeApiService
      .getRoute(this.routeId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (route) => {
          const currentCarriages = new Set<string>(route.carriages);
          this.carriages.set([...currentCarriages]);

          this.routeInformation.set(route);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  protected deleteRide(rideId: number) {
    this.routeInformation.update((routeInfo) => ({
      ...routeInfo,
      schedule: routeInfo.schedule.filter((ride) => ride.rideId !== rideId),
    }));
  }
}
