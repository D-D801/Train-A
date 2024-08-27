import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ExistingStationsListComponent } from '@features/admin/components/existing-stations-list/existing-stations-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { CreateStationFormComponent } from '@features/admin/components/create-station-form/create-station-form.component';
import { TuiScrollbar } from '@taiga-ui/core';

@Component({
  selector: 'dd-stations-page',
  standalone: true,
  imports: [CreateStationFormComponent, ExistingStationsListComponent, TuiScrollbar],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsPageComponent implements OnInit {
  private readonly stationsApiService = inject(StationsApiService);

  private readonly stationsService = inject(StationsService);

  private readonly destroy = inject(DestroyRef);

  public ngOnInit() {
    this.stationsApiService
      .retrieveStationList()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((stations) => {
        this.stationsService.setStations(stations);
      });
  }
}
