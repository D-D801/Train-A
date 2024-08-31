import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'dd-route-card',
  standalone: true,
  imports: [TuiHeader, TuiTitle, TuiIcon, NgIf],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteCardComponent {
  public trainRoute = input.required<TrainRoute>();

  public edit = output<number>();

  public delete = output<TrainRoute>();
}
