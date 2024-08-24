import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-route-form',
  standalone: true,
  imports: [],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteFormComponent {}
