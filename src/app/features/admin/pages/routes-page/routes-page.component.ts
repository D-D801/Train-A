import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-routes-page',
  standalone: true,
  imports: [],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesPageComponent {}
