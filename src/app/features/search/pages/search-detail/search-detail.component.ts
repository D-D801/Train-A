import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
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

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  public carriages = this.carriageService.carriages;

  private readonly _ride = signal<Trip | null>(null);

  public readonly ride = this._ride.asReadonly();

  public fromStation!: number;

  public toStation!: number;

  protected activeItemIndex = 0;

  public carriageList: { [key: string]: { index: number; carriage: string }[] } = {};

  private segments: RoadSection[] = [];

  public priceMap: {
    [key: string]: number;
  } = {};

  public constructor() {
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
        next: (trip: Trip) => {
          this._ride.set(trip);
          this.setPrices(trip);
          this.groupCarriages(trip.carriages);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  private groupCarriages(carriages: string[]): void {
    this.carriageList = carriages.reduce(
      (acc, carriage, index) => {
        const type = carriage;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push({ index: index + 1, carriage });
        return acc;
      },
      {} as { [key: string]: { index: number; carriage: string }[] }
    );
  }

  public get carriageTypes(): string[] {
    return Object.keys(this.carriageList);
  }

  public getCarriageByName(name: string) {
    return this.carriages().find((carriage) => carriage.name === name) ?? null;
  }

  public setPrices(trip: Trip) {
    const fromIndex = trip.path.indexOf(this.fromStation);
    const toIndex = trip.path.indexOf(this.toStation);
    if (fromIndex < 0 || toIndex < 0 || fromIndex > toIndex) {
      //  this.router.navigate(['404']); //TODO by 404
    }

    this.segments = trip.schedule.segments.slice(fromIndex, toIndex);

    this.priceMap = this.segments.reduce(
      (acc, segment) => {
        Object.entries(segment.price).forEach(([carriageType, price]) => {
          acc[carriageType] = (acc[carriageType] || 0) + price;
        });
        return acc;
      },
      {} as { [key: string]: number }
    );
  }
}
