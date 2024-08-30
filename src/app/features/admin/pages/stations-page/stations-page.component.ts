import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ExistingStationsListComponent } from '@features/admin/components/existing-stations-list/existing-stations-list.component';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { CreateStationFormComponent } from '@features/admin/components/create-station-form/create-station-form.component';
import { TuiLoader, TuiScrollbar } from '@taiga-ui/core';

@Component({
  selector: 'dd-stations-page',
  standalone: true,
  imports: [CreateStationFormComponent, ExistingStationsListComponent, TuiScrollbar, TuiLoader],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsPageComponent {
  private readonly stationsService = inject(StationsService);

  public loaderStatus: Signal<boolean> = computed(() => this.stationsService.stations() === null);
}
