import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { OrderCardComponent } from '@features/orders/components/order-card/order-card.component';
import { Order } from '@features/orders/interfaces/order.interface';
import { User } from '@features/orders/interfaces/user.interface';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';
import { UsersApiService } from '@features/orders/services/users-api/users-api.service';
import { Role } from '@shared/enums/role.enum';
import { TuiLoader } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-orders-page',
  standalone: true,
  imports: [OrderCardComponent, TuiBlockStatus, TuiLoader],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  private readonly ordersApiService = inject(OrdersApiService);

  private readonly usersApiService = inject(UsersApiService);

  private readonly authService = inject(AuthService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly role = this.authService.role;

  protected readonly orders = signal<Order[]>([]);

  protected readonly users = signal<User[]>([]);

  public readonly isLoading = signal(false);

  public constructor() {
    this.loadOrders();
  }

  public loadOrders() {
    this.isLoading.set(true);
    const ordersObservable =
      this.role() === Role.manager
        ? this.usersApiService.getUsers().pipe(
            tap((users) => this.users.set(users)),
            switchMap(() => this.ordersApiService.getOrders())
          )
        : this.ordersApiService.getOrders();

    ordersObservable.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (orders) => {
        orders.sort((a, b) => {
          const timeA = new Date(a.schedule.segments[a.path.indexOf(a.stationStart)].time[0]).getTime();
          const timeB = new Date(b.schedule.segments[b.path.indexOf(b.stationStart)].time[0]).getTime();
          return timeA - timeB;
        });

        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: ({ error: { message } }) => {
        this.isLoading.set(false);
        this.alert.open({ message, label: 'Error', appearance: 'error' });
      },
    });
  }

  public cancelOrder(orderId: number) {
    if (!orderId) return;
    this.loadOrders();
  }
}
