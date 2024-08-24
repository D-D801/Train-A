import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Schedule } from '@features/admin/interfaces/schedule.interface';
import { StationCardComponent } from '../station-card/station-card.component';

@Component({
  selector: 'dd-ride-card',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiHeader, StationCardComponent],
  templateUrl: './ride-card.component.html',
  styleUrl: './ride-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideCardComponent {
  public ride = input.required<Schedule>();
}
