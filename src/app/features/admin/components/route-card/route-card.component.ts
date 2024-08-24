import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-route-card',
  standalone: true,
  imports: [],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteCardComponent {}
