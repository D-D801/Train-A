import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageService } from '@core/services/carriage/carriage.service';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { RoadSection, Trip } from '@features/search/interfaces/search-route-response.interface';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { TuiChip, TuiTab, TuiTabs } from '@taiga-ui/kit';
import { map, switchMap } from 'rxjs';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import {
  BookSeats,
  CarriageList,
  FreeSeat,
  Price,
  TripService,
  SelectedOrder,
} from '@features/search/services/trip/trip.service';
import { OrderPanelComponent } from '@features/search/components/order-panel/order-panel.component';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';
import { TuiButton } from '@taiga-ui/core';
import { OrderRequest } from '@features/search/interfaces/order.request.interface';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'dd-search-detail-page',
  standalone: true,
  imports: [
    TuiTabs,
    TuiTab,
    NgFor,
    NgClass,
    NgIf,
    CarriagePreviewComponent,
    TuiCurrencyPipe,
    OrderPanelComponent,
    TuiChip,
    TuiButton,
    TuiHeader,
  ],
  templateUrl: './search-detail-page.component.html',
  styleUrl: './search-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly location = inject(Location);

  private readonly searchApiService = inject(SearchApiService);

  private readonly ordersApiService = inject(OrdersApiService);

  private readonly carriageService = inject(CarriageService);

  private readonly tripService = inject(TripService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public carriages = this.carriageService.carriages;

  protected readonly ride = signal<Trip | null>(null);

  protected readonly isBookSeat = signal(false);

  public orderId = signal(0);

  public options = signal({ isClick: true, isShowTitle: false });

  public fromStation: number = 0;

  public toStation: number = 0;

  protected activeItemIndex = 0;

  private carriageList: CarriageList = {};

  private segments: RoadSection[] = [];

  public price: Price = {};

  public selectedOrder: SelectedOrder = { seatNumber: 0, carriageNumber: 0, globalSeatNumber: 0, price: 0 };

  private selectedCarriageIndex: number | null = null;

  private bookSeats: BookSeats[] = [];

  private freeSeats: FreeSeat = {};

  public constructor() {
    this.loadRide();

    effect(() => {
      const ride = this.ride();
      if (!ride) return;
      const fromIndex = ride.path.indexOf(this.fromStation);
      const toIndex = ride.path.indexOf(this.toStation);
      if (fromIndex < 0 || toIndex < 0 || fromIndex > toIndex) {
        return;
        this.router.navigate(['/404']); // TODO by 404
      }
      this.carriageList = this.tripService.groupCarriages(ride.carriages);
      this.segments = ride.schedule.segments.slice(fromIndex, toIndex);
      this.price = this.tripService.setPrices(this.segments);

      this.bookSeats = this.tripService.getOccupieSeatsInCarriages(this.segments[0].occupiedSeats, ride.carriages);

      this.freeSeats = this.tripService.getAvailableSeats(this.bookSeats, this.carriageList);
    });
  }

  private loadRide() {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroy),
        switchMap((params) => {
          const rideIdParam = Number(params['id']);

          return this.route.queryParams.pipe(
            map((queryParams) => {
              this.fromStation = Number(queryParams['from']);
              this.toStation = Number(queryParams['to']);
              return rideIdParam;
            }),
            switchMap((rideId) => this.searchApiService.searchId(rideId))
          );
        })
      )
      .subscribe({
        next: (ride: Trip) => {
          this.ride.set(ride);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  public goBack(): void {
    this.location.back();
  }

  public getCarriageTypes() {
    return Object.keys(this.carriageList);
  }

  public getCarriageListForType(type: string) {
    return this.carriageList[type] || [];
  }

  public getFilteredSeats(carriageIndex: number) {
    return this.bookSeats.filter((seat) => seat.carriageIndex === carriageIndex);
  }

  public getFreeSeatsByCarriage(index: number) {
    return this.freeSeats[index]?.availableSeats || 0;
  }

  public getCarriageByName(name: string) {
    return this.carriages().find((carriage) => carriage.name === name) ?? null;
  }

  public totalSeatsForType(type: string): number {
    return this.tripService.sumSeatsByType(this.freeSeats, type);
  }

  public setTimes(time: string) {
    return this.tripService.setTimes(this.segments, time);
  }

  public getCarriageClass(index: number) {
    return this.selectedCarriageIndex === index;
  }

  public handleSeatSelected(event: { seatNumber: number; carriageType: string }, index: number) {
    this.selectedOrder = {
      ...this.selectedOrder,
      seatNumber: event.seatNumber,
      carriageNumber: index,
      price: this.price[event.carriageType],
    };

    this.selectedCarriageIndex = index;
    const carriages = this.ride()?.carriages;
    if (!carriages) return;
    this.selectedOrder.globalSeatNumber = this.tripService.calculateGlobalSeatNumber(
      carriages,
      index,
      event.seatNumber
    );
  }

  public bookSeat(selectedOrder: SelectedOrder) {
    if (!selectedOrder.globalSeatNumber) return;
    const rideId = this.ride()?.rideId;
    const seat = this.selectedOrder.globalSeatNumber;
    const stationStart = this.fromStation;
    const stationEnd = this.toStation;
    if (!rideId || !seat || !stationStart || !stationEnd) return;

    const orderObservable = this.orderId()
      ? this.ordersApiService.deleteOrder(this.orderId()).pipe(
          takeUntilDestroyed(this.destroy),
          switchMap(() => this.createOrder({ rideId, seat, stationStart, stationEnd }))
        )
      : this.createOrder({ rideId, seat, stationStart, stationEnd });

    orderObservable.subscribe({
      next: ({ id }) => {
        this.orderId.set(id);
        this.loadRide();
        this.isBookSeat.update((value) => !value);
        this.alert.open({ message: 'Seat booked successfully', label: 'Info:', appearance: 'success' });
      },
      error: ({ error: { message } }) => {
        this.alert.open({ message, label: 'Error', appearance: 'error' });
      },
    });
  }

  private createOrder({ rideId, seat, stationStart, stationEnd }: OrderRequest) {
    return this.ordersApiService
      .createOrder({ rideId, seat, stationStart, stationEnd })
      .pipe(takeUntilDestroyed(this.destroy));
  }
}
