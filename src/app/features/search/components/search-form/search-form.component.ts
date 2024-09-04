import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsService } from '@core/services/stations/stations.service';
import { Station } from '@features/admin/interfaces/station-list-item.interface';
import { SearchFilterComponent } from '@features/search/components/search-filter/search-filter.component';
import { CityCoordinates } from '@features/search/interfaces/city-coordinates.interface';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { SearchService } from '@features/search/services/search/search.service';
import { findDepartureDatesOfRide } from '@features/search/utils/find-departure-dates-of-ride';
import { generateDates } from '@features/search/utils/generate-filter-dates';
import { groupeRidesWithDates } from '@features/search/utils/groupe-rides-with-dates';
import { dateValidator } from '@features/search/validators/date.validator';
import { convertDateToISODateWithoutTime } from '@shared/utils/date-converter';

import { TuiDay, TuiLet, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { debounceTime } from 'rxjs';

type InputName = 'from' | 'to';

@Component({
  selector: 'dd-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiLet,
    AsyncPipe,
    TuiTextfieldControllerModule,
    NgIf,
    TuiDataList,
    NgForOf,
    TuiInitialsPipe,
    TuiDataListWrapper,
    TuiTextfield,
    TuiInputDateTimeModule,
    TuiButton,
    NgTemplateOutlet,
    TitleCasePipe,
    SearchFilterComponent,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  private readonly stationsService = inject(StationsService);

  private readonly searchService = inject(SearchService);

  private readonly searchApiService = inject(SearchApiService);

  private readonly fb = inject(FormBuilder);

  private readonly locationService = inject(LocationApiService);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  public stations = this.stationsService.stations;

  public cities = this.searchService.searchCities;

  private fromCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private toCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private selectedCityIndex: number = 0;

  private startDateWithoutTime = '';

  private endDateWithoutTime = '';

  // private readonly departureStation = signal<SearchFromStation | null>(null);

  // private readonly arrivalStation = signal<SearchToStation | null>(null);

  // private readonly filteredRides = signal<number[]>([]);

  // protected readonly filterDates = signal<DepartureDateWithIds[]>([]);

  public searchForm = this.fb.group({
    from: this.fb.control('', [Validators.required]),
    to: this.fb.control('', [Validators.required]),
    date: this.fb.control<[TuiDay, TuiTime]>([TuiDay.currentUtc(), new TuiTime(0, 0)], dateValidator()),
  });

  public ngOnInit() {
    const { from, to } = this.searchForm.controls;
    from.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.from.value) return;
      this.updateCities(this.from.value, 'from');
    });
    to.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.to.value) return;
      this.updateCities(this.to.value, 'to');
    });
  }

  public updateCities(city: string, inputName: InputName) {
    const stationsArray = this.stations();
    if (!stationsArray) return;
    const receivedCities = stationsArray.filter((item) => item.city.toLowerCase().includes(city.toLowerCase()));
    this.searchService.setSearchCities(receivedCities);
    const receivedCity = receivedCities[this.selectedCityIndex];
    if (receivedCities.length === 0 || this.selectedCityIndex < 0 || !receivedCity) return;
    const { latitude, longitude } = receivedCity;
    if (inputName === 'from') {
      this.fromCityCoordinates = {
        latitude,
        longitude,
      };
    } else {
      this.toCityCoordinates = {
        latitude,
        longitude,
      };
    }
  }

  public onSelected(city: Station, inputName: string, index: number) {
    this.selectedCityIndex = index;
    if (inputName === 'from') {
      this.from.setValue(city.city);
    }
    if (inputName === 'to') {
      this.to.setValue(city.city);
    }
  }

  public search() {
    if (this.searchForm.invalid) return;
    let date = '';
    // console.error(this.date.value);
    if (this.date.value) {
      const [{ day, month, year }, { hours, minutes }] = this.date.value;
      date = new Date(year, month, day, hours, minutes).toISOString();
    }
    this.searchApiService
      .search({
        fromLatitude: this.fromCityCoordinates.latitude,
        fromLongitude: this.fromCityCoordinates.longitude,
        toLatitude: this.toCityCoordinates.latitude,
        toLongitude: this.toCityCoordinates.longitude,
        time: date,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (response) => {
          if (this.date.value) {
            const [{ day, month, year }] = this.date.value;
            this.startDateWithoutTime = convertDateToISODateWithoutTime(new Date(Date.UTC(year, month, day)));
          }
          this.searchService.departureStation.set(response.from);
          this.searchService.arrivalStation.set(response.to);
          const sortedRidesWidthDepartureDate = findDepartureDatesOfRide(response);

          this.endDateWithoutTime = sortedRidesWidthDepartureDate.at(-1)?.departureDate ?? '';
          const dates = generateDates(this.startDateWithoutTime, this.endDateWithoutTime);

          const updatedDates = groupeRidesWithDates(dates, sortedRidesWidthDepartureDate);
          // this.filterDates.set(updatedDates);
          this.searchService.setfilterDates(updatedDates);
          // this.searchService.setSearchResult(response);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  // eslint-disable-next-line class-methods-use-this
  public getMinDate() {
    return new TuiDay(
      new Date(Date.now()).getFullYear(),
      new Date(Date.now()).getMonth(),
      new Date(Date.now()).getDay() + 1
    );
  }

  public get from() {
    return this.searchForm.controls.from;
  }

  public get to() {
    return this.searchForm.controls.to;
  }

  public get date() {
    return this.searchForm.controls.date;
  }
  //
  // public onFilterSelect(index: number) {
  //   // TODO: filterDates()[index].rideIds must be passed to search-result-list
  //   // eslint-disable-next-line no-console
  //   console.log('filteredRides', index, this.filterDates()[index].rideIds);
  // }
}
