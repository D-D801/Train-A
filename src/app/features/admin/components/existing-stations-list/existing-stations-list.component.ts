import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { ConnectedStation } from '@features/admin/interfaces/station-list-item.interface';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiIconPipe, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { tap } from 'rxjs';

@Component({
  selector: 'dd-existing-stations-list',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiPlatform, TuiButton, NgFor, TuiIcon, TuiIconPipe],
  templateUrl: './existing-stations-list.component.html',
  styleUrl: './existing-stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingStationsListComponent {
  private readonly stationsService = inject(StationsService);

  private readonly stationsApiService = inject(StationsApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public readonly stations = this.stationsService.stations;

  public deleteStation(id: number) {
    this.stationsApiService
      .retrieveOrders()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((orders) => {
        const hasActiveRide = orders.some((order) => order.status === 'active' && order.path.includes(id));
        if (hasActiveRide) {
          this.alert.open({ message: 'Cannot delete station with active rides', label: 'Error', appearance: 'error' });
        }
      });
    this.stationsApiService
      .deleteStation(id)
      .pipe(
        tap(() => {
          this.stationsService.deleteStationFromList(id);
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  public getStations(connectedStations: ConnectedStation[]) {
    const connectedStationsIds = connectedStations.map((station) => station.id);
    return this.stationsService.getStations(connectedStationsIds);
  }
}
