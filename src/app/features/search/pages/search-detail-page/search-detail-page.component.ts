import { NgClass, NgFor, NgIf } from '@angular/common';
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
  RideService,
  SelectedOrder,
} from '@features/search/services/ride/ride.service';
import { OrderPanelComponent } from '@features/search/components/order-panel/order-panel.component';
import { OrdersApiService } from '@features/orders/services/orders-api/orders-api.service';

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
  ],
  templateUrl: './search-detail-page.component.html',
  styleUrl: './search-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly searchApiService = inject(SearchApiService);

  private readonly ordersApiService = inject(OrdersApiService);

  private readonly carriageService = inject(CarriageService);

  private readonly rideService = inject(RideService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public carriages = this.carriageService.carriages;

  private readonly _ride = signal<Trip | null>(null);

  public readonly ride = this._ride.asReadonly();

  private readonly _isBookSeat = signal(false);

  public readonly isBookSeat = this._isBookSeat.asReadonly();

  public orderId = signal(0);

  public options = signal({ isClick: true, isShowTitle: false });

  public fromStation!: number;

  public toStation!: number;

  protected activeItemIndex = 0;

  public carriageList: CarriageList = {};

  private segments: RoadSection[] = [];

  public price: Price = {};

  public selectedOrder: SelectedOrder = { seatNumber: 0, carriageNumber: 0, globalSeatNumber: 0, price: 0 };

  public selectedCarriageIndex: number | null = null;

  public bookSeats: BookSeats[] = [];

  public freeSeats: FreeSeat = {};

  public constructor() {
    this.loadRide();

    effect(() => {
      if (this._ride()) {
        const ride = this._ride();
        if (!ride) return;
        const fromIndex = ride.path.indexOf(this.fromStation);
        const toIndex = ride.path.indexOf(this.toStation);
        if (fromIndex < 0 || toIndex < 0 || fromIndex > toIndex) {
          //  this.router.navigate(['404']); //TODO by 404
        }
        this.carriageList = this.rideService.groupCarriages(ride.carriages);
        this.segments = ride.schedule.segments.slice(fromIndex, toIndex);
        this.price = this.rideService.setPrices(this.segments);

        this.bookSeats = this.rideService.getOccupieSeatsInCarriages(this.segments[0].occupiedSeats, ride.carriages);

        this.freeSeats = this.rideService.getAvailableSeats(this.bookSeats, this.carriageList);
      }
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
          this._ride.set(ride);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  public get carriageTypes() {
    return Object.keys(this.carriageList);
  }

  public getCarriageByName(name: string) {
    return this.carriages().find((carriage) => carriage.name === name) ?? null;
  }

  public setTimes(time: string) {
    return this.rideService.setTimes(this.segments, time);
  }

  public handleSeatSelected(event: { seatNumber: number; carriageType: string }, index: number) {
    this.selectedOrder = {
      ...this.selectedOrder,
      seatNumber: event.seatNumber,
      carriageNumber: index,
      price: this.price[event.carriageType],
    };

    this.selectedCarriageIndex = index;
    const { seatNumber, carriageType } = event;
    const carriages = this._ride()?.carriages;
    if (!carriages) return;
    this.selectedOrder.globalSeatNumber = this.rideService.calculateGlobalSeatNumber(
      carriages,
      carriageType,
      index,
      seatNumber
    );
  }

  public getCarriageClass(index: number) {
    return this.selectedCarriageIndex === index;
  }

  protected bookSeat(selectedOrder: SelectedOrder) {
    if (!selectedOrder.globalSeatNumber) return;
    const rideId = this.ride()?.rideId;
    const seat = this.selectedOrder.globalSeatNumber;
    const stationStart = this.fromStation;
    const stationEnd = this.toStation;
    if (!rideId || !seat || !stationStart || !stationEnd) return;
    this.ordersApiService
      .createOrder({ rideId, seat, stationStart, stationEnd })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: ({ id }) => {
          this.orderId.set(id);
          this.loadRide();
          this._isBookSeat.update((value) => !value);
          this.options().isClick = false;
          this.alert.open({ message: 'Seat booked successfully', label: 'Info:', appearance: 'success' });
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  protected cancelTrip() {
    // this.ordersApiService
    //   .deleteOrder(this.orderId())
    //   .pipe(takeUntilDestroyed(this.destroy))
    //   .subscribe({
    //     next: () => {
    //       this._isBookSeat.update((value) => !value);
    //       this.options().isClick = true;
    //     },
    //     error: ({ error: { message } }) => {
    //       this.alert.open({ message, label: 'Error', appearance: 'error' });
    //     },
    //   });
  }

  public getFilteredSeatsByCarriageIndex(carriageIndex: number) {
    return this.bookSeats.filter((seat) => seat.carriageIndex === carriageIndex);
  }
}
