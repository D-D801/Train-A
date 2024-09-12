import { KeyValuePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { RideModalService } from '@shared/services/ride-modal.service';
import { TuiChip, TuiTab, TuiTabs, TuiTabsWithMore } from '@taiga-ui/kit';
import { map, switchMap } from 'rxjs';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TripService } from '@features/search/services/trip/trip.service';
import { OrderPanelComponent } from '@features/search/components/order-panel/order-panel.component';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';
import { TuiButton, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { CURRENCY } from '@shared/constants/currency';
import { Price, Segment } from '@shared/interfaces/segment.interface';
import { OrderRequest } from '@features/orders/interfaces/order.request.interface';
import { StationsService } from '@core/services/stations/stations.service';
import { Trip } from '@features/search/interfaces/trip.interface';
import { CarriageList } from '@features/search/interfaces/carriage-list.interface';
import { SelectedOrder } from '@features/search/interfaces/selected-order.interface';
import { BookSeats } from '@shared/interfaces/book-seats.interface';
import { FreeSeat } from '@features/search/interfaces/free-seat.interface';
import { CarriagesService } from '@core/services/carriages/carriages.service';

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
    TuiIcon,
    TuiTabsWithMore,
    KeyValuePipe,
    TuiLoader,
  ],
  templateUrl: './search-detail-page.component.html',
  styleUrl: './search-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDetailPageComponent {
  protected readonly stationsService = inject(StationsService);

  protected readonly carriagesService = inject(CarriagesService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly location = inject(Location);

  private readonly searchApiService = inject(SearchApiService);

  private readonly ordersApiService = inject(OrdersApiService);

  protected readonly tripService = inject(TripService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly rideModalService = inject(RideModalService);

  protected readonly ride = signal<Trip | null>(null);

  protected readonly isBookSeat = signal(false);

  public orderId = signal(0);

  public options = signal({ isClick: true, isShowTitle: false });

  protected readonly isLoading = signal(false);

  public fromStation: number = 0;

  public toStation: number = 0;

  protected activeItemIndex = 0;

  protected carriageList: CarriageList = {};

  private segments: Segment[] = [];

  public price: Price = {};

  public selectedOrder: SelectedOrder = { seatNumber: 0, carriageNumber: 0, globalSeatNumber: 0, price: 0 };

  private selectedCarriageIndex: number | null = null;

  private bookSeats: BookSeats[] = [];

  private freeSeats: FreeSeat = {};

  protected currency = CURRENCY;

  public constructor() {
    this.loadRide();

    effect(() => {
      const ride = this.ride();
      if (!ride) return;
      const fromIndex = ride.path.indexOf(this.fromStation);
      const toIndex = ride.path.indexOf(this.toStation);
      if (fromIndex < 0 || toIndex < 0 || fromIndex > toIndex) {
        this.router.navigate(['/404']);
        return;
      }
      this.carriageList = this.tripService.groupCarriages(ride.carriages);
      this.segments = ride.schedule.segments.slice(fromIndex, toIndex);
      this.price = this.tripService.setPrices(this.segments);

      const longestSegmentIndex = this.segments
        .map((segment, index) => ({ length: segment.occupiedSeats?.length ?? 0, index }))
        .reduce((max, current) => (current.length > max.length ? current : max), { length: 0, index: -1 }).index;

      this.bookSeats =
        longestSegmentIndex > -1
          ? this.tripService.getOccupieSeatsInCarriages(
              this.segments[longestSegmentIndex].occupiedSeats ?? [],
              ride.carriages
            )
          : [];

      this.freeSeats = this.tripService.getAvailableSeats(this.bookSeats, this.carriageList);
    });
  }

  private loadRide() {
    this.isLoading.set(true);
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
          this.isLoading.set(false);
        },
        error: ({ error: { message } }) => {
          this.isLoading.set(false);
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  public getCarriageList() {
    return Object.keys(this.carriageList).length > 0;
  }

  protected onClick(activeItemIndex: number): void {
    this.activeItemIndex = activeItemIndex;
  }

  public goBack(): void {
    this.location.back();
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

  protected showModal() {
    const ride = this.ride();
    if (!ride) return;
    this.rideModalService
      .showRideInfo({ from: this.fromStation, to: this.toStation, ride })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe();
  }
}
