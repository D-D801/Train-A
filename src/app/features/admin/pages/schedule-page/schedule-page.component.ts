import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, Location, NgFor } from '@angular/common';

import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
import { merge, Subject, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RideCardComponent } from '../../components/ride-card/ride-card.component';
import { NewRideFormComponent } from '../../components/new-ride-form/new-ride-form.component';

@Component({
  selector: 'dd-schedule-page',
  standalone: true,
  imports: [TuiButton, RideCardComponent, AsyncPipe, NgFor, NewRideFormComponent],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewRideService],
})
export class SchedulePageComponent implements OnInit {
  private readonly routeApiService = inject(RouteApiService);

  protected readonly newRideService = inject(NewRideService);

  private readonly route = inject(ActivatedRoute);

  private readonly location = inject(Location);

  private readonly alert = inject(AlertService);

  public readonly destroy = inject(DestroyRef);

  protected routeInformation = signal<TrainRoute>({} as TrainRoute);

  protected carriages = signal<string[]>([]);

  private readonly routeUpdateSubject$$ = new Subject<number>();

  protected routeInformation$ = merge(
    this.route.paramMap.pipe(
      switchMap((params) => this.routeApiService.getRoute(Number(params.get('id')))),
      tap((route) => {
        const currentCarriages = new Set<string>(route.carriages);
        this.carriages.set([...currentCarriages]);

        this.routeInformation.set(route);
      })
    ),
    this.routeUpdateSubject$$.pipe(
      switchMap((routeId) => this.routeApiService.getRoute(routeId)),
      tap((route) => {
        this.routeInformation.set(route);
      })
    )
  ).pipe(
    tap({
      error: ({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
      },
    }),
    takeUntilDestroyed()
  );

  public ngOnInit() {
    this.routeInformation$.subscribe();
  }

  protected updateRouteInfo(routeId: number) {
    this.routeUpdateSubject$$.next(routeId);
  }

  protected navigationBack() {
    this.location.back();
  }
}
