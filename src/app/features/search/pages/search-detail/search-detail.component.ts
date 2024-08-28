import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriageService } from '@core/services/carriage/carriage.service';
import { CarriagePreviewComponent } from '@features/admin/components/carriage-preview/carriage-preview.component';
import { RoadSection, Trip } from '@features/search/interfaces/search-route-response.interface';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { TuiTab, TuiTabs } from '@taiga-ui/kit';
import { map, switchMap } from 'rxjs';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { CarriageList, Price, RideService } from '@features/search/services/ride/ride.service';

@Component({
  selector: 'dd-search-detail',
  standalone: true,
  imports: [TuiTabs, TuiTab, NgFor, NgClass, NgIf, CarriagePreviewComponent, TuiCurrencyPipe],
  templateUrl: './search-detail.component.html',
  styleUrl: './search-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly searchApiService = inject(SearchApiService);

  private readonly carriageService = inject(CarriageService);

  private readonly rideService = inject(RideService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public carriages = this.carriageService.carriages;

  private readonly _ride = signal<Trip | null>(null);

  public readonly ride = this._ride.asReadonly();

  public fromStation!: number;

  public toStation!: number;

  protected activeItemIndex = 0;

  public carriageList: CarriageList = {};

  private segments: RoadSection[] = [];

  public price: Price = {};

  public globalSeatNumber = 0;

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
    // console.log(`Seat number: ${event.seatNumber}, carriage type: ${event.carriageType}, Carriage index: ${index}`);

    const { seatNumber, carriageType } = event;
    this.globalSeatNumber = this.rideService.calculateGlobalSeatNumber(
      this._ride()?.carriages || [],
      carriageType,
      index,
      seatNumber
    );
    // console.log(`Global seat number: ${this.globalSeatNumber}`);
  }
}
