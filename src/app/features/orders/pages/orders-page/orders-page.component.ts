import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { Order } from '@features/orders/interfaces/order.interface';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';

@Component({
  selector: 'dd-orders-page',
  standalone: true,
  imports: [],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  private readonly ordersApiService = inject(OrdersApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  protected readonly orders = signal<Order[]>([]);

  public constructor() {
    this.loadOrders();
  }

  public loadOrders() {
    return this.ordersApiService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
