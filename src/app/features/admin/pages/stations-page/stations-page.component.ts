import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExistingStationsListComponent } from '@features/admin/components/existing-stations-list/existing-stations-list.component';
import { CreateStationFormComponent } from '../../components/create-station-form/create-station-form.component';

@Component({
  selector: 'dd-stations-page',
  standalone: true,
  imports: [CreateStationFormComponent, ExistingStationsListComponent],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsPageComponent {}
