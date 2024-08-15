import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-orders-page',
  standalone: true,
  imports: [],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {}
