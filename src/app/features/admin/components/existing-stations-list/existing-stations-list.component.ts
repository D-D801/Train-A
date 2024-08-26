import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiButton, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'dd-existing-stations-list',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiPlatform, TuiButton, NgFor],
  templateUrl: './existing-stations-list.component.html',
  styleUrl: './existing-stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingStationsListComponent {
  private readonly stationsService = inject(StationsService);

  private readonly stationsApiService = inject(StationsApiService);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly existingStations = this.stationsService;

  public readonly stations = this.stationsService.stations;

  public deleteStation(id: number) {
    this.stationsApiService.deleteStation(id);
    this.stationsService.deleteStationFromList(id);
  }
}
