import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiIconPipe, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

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
    let hasActiveRide;
    this.stationsApiService
      .retrieveOrders()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((orders) => {
        hasActiveRide = orders.some((order) => order.status === 'active' && order.path.includes(id));
      });
    if (hasActiveRide) {
      this.alert.open({ message: 'Cannot delete station with active rides', label: 'Error', appearance: 'error' });
      return;
    }
    this.stationsApiService.deleteStation(id);
    this.stationsService.deleteStationFromList(id);
  }

  public getStations(id: number) {
    return this.stationsService.getStation(id);
  }
}
