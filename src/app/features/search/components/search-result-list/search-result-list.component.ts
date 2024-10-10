import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StationsService } from '@core/services/stations/stations.service';
import { FreeSeat } from '@features/search/interfaces/free-seat.interface';
import { Trip } from '@features/search/interfaces/trip.interface';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { TripService } from '@features/search/services/trip/trip.service';
import { Segment } from '@shared/interfaces/segment.interface';
import { RideModalService } from '@shared/services/ride-modal.service';
import { calculateTrainStopDuration } from '@shared/utils/calculateTrainStopDuration';
import { convertToDateWithTime } from '@shared/utils/convertToDateWithTime';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiBlockStatus, TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { forkJoin, take, tap } from 'rxjs';

interface SearchResult {
  from: {
    city: string;
    stationId: number;
  };
  routes: number[];
  to: {
    city: string;
    stationId: number;
  };
}

const getUniqueCarriages = (carriages: string[]) => {
  return [...new Set(carriages)];
};

@Component({
  selector: 'dd-search-result-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    TuiCardLarge,
    TuiTitle,
    TuiHeader,
    TuiCardLarge,
    TuiSurface,
    TuiPlatform,
    TuiButton,
    TuiBlockStatus,
    TuiIcon,
    KeyValuePipe,
  ],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultListComponent {
  public searchResult = input.required<SearchResult>();

  private readonly searchApiService = inject(SearchApiService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroy = inject(DestroyRef);

  private readonly stationsService = inject(StationsService);

  private readonly tripService = inject(TripService);

  private readonly rideModalService = inject(RideModalService);

  public rides: Trip[] | null = null;

  public getTravelTime = calculateTrainStopDuration;

  public getUniqueCarriages = getUniqueCarriages;

  public convertTime = convertToDateWithTime;

  public constructor() {
    effect(() => {
      if (!this.searchResult()) return;

      forkJoin(this.searchResult().routes.map((routeId) => this.searchApiService.searchId(routeId)))
        .pipe(
          tap((trips) => {
            this.rides = trips;
            this.cdr.markForCheck();
          }),
          take(1),
          takeUntilDestroyed(this.destroy)
        )
        .subscribe();
    });
  }

  public getPrice(segments: Segment[]) {
    return this.tripService.setPrices(segments);
  }

  public showRouteModal(from: number, to: number, ride: Trip, event: Event) {
    event.stopPropagation();
    if (!ride) return;
    this.rideModalService.showRideInfo({ from, to, ride }).pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }

  public getStation(station: number) {
    return this.stationsService.getStations([station])[0];
  }

  public getFreeSeats(segments: Segment[], carriages: string[]) {
    const longestSegmentIndex = segments
      .map((segment, index) => ({ length: segment.occupiedSeats?.length ?? 0, index }))
      .reduce((max, current) => (current.length > max.length ? current : max), { length: 0, index: -1 }).index;

    const bookSeats =
      longestSegmentIndex > -1
        ? this.tripService.getOccupieSeatsInCarriages(segments[longestSegmentIndex].occupiedSeats ?? [], carriages)
        : [];

    const carriageList = this.tripService.groupCarriages(carriages);

    return this.tripService.getAvailableSeats(bookSeats, carriageList);
  }

  public getCarriageTypes(carriages: string[]) {
    return this.tripService.groupCarriages(carriages);
  }

  public getCarriageListForType(carriages: string[], type: string) {
    return this.tripService.groupCarriages(carriages)[type] || [];
  }

  public totalSeatsForType(freeSeats: FreeSeat, type: string): number {
    return this.tripService.sumSeatsByType(freeSeats, type);
  }
}
