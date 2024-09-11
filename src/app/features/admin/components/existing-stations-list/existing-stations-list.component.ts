import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsService } from '@core/services/stations/stations.service';
import { ConnectedStation } from '@features/admin/interfaces/station-list-item.interface';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiIcon, TuiIconPipe, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-existing-stations-list',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiPlatform, NgFor, TuiIcon, TuiIconPipe],
  templateUrl: './existing-stations-list.component.html',
  styleUrl: './existing-stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingStationsListComponent {
  private readonly stationsService = inject(StationsService);

  private readonly stationsApiService = inject(StationsApiService);

  private readonly ordersApiService = inject(OrdersApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public readonly stations = this.stationsService.stations;

  public deleteStation(id: number) {
    this.ordersApiService
      .retrieveOrders()
      .pipe(
        filter((orders) => {
          const hasActiveRide = orders.some((order) => order.status === 'active' && order.path.includes(id));
          if (hasActiveRide) {
            this.alert.open({
              message: 'Cannot delete station with active rides',
              label: 'Error',
              appearance: 'error',
            });
          }
          return !hasActiveRide;
        }),
        switchMap(() => this.stationsApiService.deleteStation(id)),
        tap(() => {
          this.stationsService.deleteStationFromList(id);
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public getStations(connectedStations: ConnectedStation[]) {
    const connectedStationsIds = connectedStations.map((station) => station.id);
    return this.stationsService.getStations(connectedStationsIds);
  }
}
