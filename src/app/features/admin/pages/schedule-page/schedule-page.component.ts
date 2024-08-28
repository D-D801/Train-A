import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Route } from '@features/admin/interfaces/route.interface';
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
  protected routeId = 16;

  private readonly routeApiService = inject(RouteApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  protected isOpenNewRideForm = false;

  protected routeInformation = signal<Route>({} as Route);

  public constructor() {
    this.routeApiService
      .getRoute(this.routeId)
      .pipe(
        tap({
          next: (route) => this.routeInformation.set(route),
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  protected onRideDelete(rideId: number): void {
    this.routeInformation.update((routeInfo) => ({
      ...routeInfo,
      schedule: routeInfo.schedule.filter((ride) => ride.rideId !== rideId),
    }));
  }
}
