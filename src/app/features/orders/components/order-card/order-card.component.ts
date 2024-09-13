import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Order } from '@features/orders/interfaces/order.interface';
import { User } from '@features/orders/interfaces/user.interface';
import { TuiButton, TuiDialogService, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { CURRENCY } from '@shared/constants/currency';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { getDeletionConfirmationData } from '@shared/utils/getDeletionConfirmationData';
import { filter, switchMap } from 'rxjs';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Role } from '@shared/enums/role.enum';
import { StationsService } from '@core/services/stations/stations.service';
import { TripService } from '@features/search/services/trip/trip.service';
import { calculateTrainStopDuration } from '@shared/utils/calculateTrainStopDuration';

@Component({
  selector: 'dd-order-card',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiHeader, TuiButton, TuiCurrencyPipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent {
  public order = input.required<Order>();

  public users = input.required<User[]>();

  public cancelOrder = output<number>();

  protected readonly stationsService = inject(StationsService);

  private readonly authService = inject(AuthService);

  private readonly tripService = inject(TripService);

  private readonly dialogs = inject(TuiDialogService);

  private readonly ordersApiService = inject(OrdersApiService);

  public readonly alert = inject(AlertService);

  public readonly destroy = inject(DestroyRef);

  private readonly role = this.authService.role;

  protected currency = CURRENCY;

  public segments = computed(() => {
    return this.order().schedule.segments.slice(
      this.order().path.indexOf(this.order().stationStart),
      this.order().path.indexOf(this.order().stationEnd)
    );
  });

  public price = computed(() => {
    return this.tripService.setPrices(this.segments());
  });

  public bookSeat = computed(() => {
    return this.tripService.getOccupieSeatsInCarriages([this.order().seatId], this.order().carriages)[0];
  });

  public isAdmin() {
    return this.role() === Role.manager;
  }

  public getUserName(userid: number) {
    const userName = this.users().find((item) => item.id === userid)?.name;
    if (!userName) return '';
    return userName;
  }

  public setTimes(time: string) {
    return this.tripService.setTimes(this.segments(), time);
  }

  public duration() {
    if (!this.segments().length) return '';
    return calculateTrainStopDuration(this.segments()[this.segments().length - 1].time[1], this.segments()[0].time[0]);
  }

  public onCancel(event: MouseEvent) {
    event.stopPropagation();
    const userName =
      this.order().userId && this.role() === Role.manager ? `( ${this.getUserName(this.order().userId)} )` : '';
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Cancel ${this.order().id} order ${userName}`,
        size: 'm',
        data: getDeletionConfirmationData(`order`),
      })
      .pipe(
        filter((isConfirmed) => isConfirmed),
        switchMap(() => this.ordersApiService.deleteOrder(this.order().id)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: () => {
          this.cancelOrder.emit(this.order().id);
          this.alert.open({
            message: `Order ${this.order().rideId} successful canceled.`,
            label: 'Cancel order',
            appearance: 'success',
          });
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
