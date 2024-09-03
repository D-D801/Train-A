import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarriagesService } from '@core/services/carriages/carriages.service';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'dd-route-card',
  standalone: true,
  imports: [TuiHeader, TuiTitle, TuiIcon, NgIf, RouterLink],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteCardComponent {
  public trainRoute = input.required<TrainRoute>();

  public edit = output<number>();

  public delete = output<TrainRoute>();

  protected readonly carriagesService = inject(CarriagesService);
}
