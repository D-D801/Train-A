import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, Location, NgFor } from '@angular/common';

import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
import { switchMap, tap } from 'rxjs';
import { Route } from '@features/admin/interfaces/route.interface';
import { ActivatedRoute } from '@angular/router';
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
  private readonly routeApiService = inject(RouteApiService);

  protected readonly newRideService = inject(NewRideService);

  private readonly route = inject(ActivatedRoute);

  private readonly location = inject(Location);

  private readonly alert = inject(AlertService);

  public readonly destroy = inject(DestroyRef);

  protected routeInformation = signal<Route>({} as Route);

  protected carriages = signal<string[]>([]);

  protected routeInformation$ = this.route.paramMap.pipe(
    switchMap((params) => this.routeApiService.getRoute(Number(params.get('id')))),
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
    takeUntilDestroyed()
  );

  public constructor() {
    this.routeInformation$.subscribe();
  }

  protected updateRouteInfo() {
    this.routeInformation$.subscribe();
  }

  protected navigationBack() {
    this.location.back();
  }
}
