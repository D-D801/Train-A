import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Price } from '@features/admin/interfaces/segment.interface';
import { Station } from '@features/admin/interfaces/station-list-item.interface';
import { Order } from '@features/orders/interfaces/order.interface';
import { User } from '@features/orders/interfaces/user.interface';
import { RoadSection } from '@features/search/interfaces/search-route-response.interface';
import { BookSeats, TripService } from '@features/search/services/trip/trip.service';
import { TuiButton, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { CURRENCY } from '@shared/constants/currency';

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

  private readonly httpClient = inject(HttpClient);

  private readonly tripService = inject(TripService);

  private readonly stations = toSignal(this.httpClient.get<Station[]>('/api/station'));

  protected readonly isAdmin = true;

  private segments: RoadSection[] = [];

  public price: Price = {};

  public bookSeat!: BookSeats;

  protected currency = CURRENCY;

  public constructor() {
    effect(() => {
      const order = this.order();
      const fromIndex = order.path.indexOf(order.stationStart);
      const toIndex = order.path.indexOf(order.stationEnd);

      this.segments = order.schedule.segments.slice(fromIndex, toIndex);
      this.price = this.tripService.setPrices(this.segments);

      [this.bookSeat] = this.tripService.getOccupieSeatsInCarriages([order.seatId], order.carriages);
    });
  }

  public onCancel(orderId: number) {
    this.cancelOrder.emit(orderId);
  }

  public getUserName(userid: number) {
    return this.users().find((item) => item.id === userid)?.name;
  }

  public getStationById(id: number) {
    return this.stations()?.find((item) => item.id === id)?.city;
  }
}
