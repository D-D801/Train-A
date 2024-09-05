import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsService } from '@core/services/stations/stations.service';
import { SearchFilterComponent } from '@features/search/components/search-filter/search-filter.component';
import { CityCoordinates } from '@features/search/interfaces/city-coordinates.interface';
import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { SearchFilterService } from '@features/search/services/search-filter/search-filter.service';
import { SearchService } from '@features/search/services/search/search.service';
import { findDepartureDatesOfRide } from '@features/search/utils/find-departure-dates-of-ride';
import { generateDates } from '@features/search/utils/generate-filter-dates';
import { groupeRidesWithDates } from '@features/search/utils/groupe-rides-with-dates';
import { convertDateToISODateWithoutTime } from '@shared/utils/date-converter';
import { getCurrentDate } from '@shared/utils/getCurrentDateTime';
import { dateValidator } from '@shared/validators/date-time.validator';

import { TuiDay, TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

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
    TuiInputDateModule,
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

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly searchFilterService = inject(SearchFilterService);

  public stations = this.stationsService.stations;

  public cities = this.searchService.searchCities;

  private fromCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private toCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private startDateWithoutTime = '';

  private endDateWithoutTime = '';

  protected readonly isLoading = signal(false);

  protected getCurrentDate = getCurrentDate;

  public searchForm = this.fb.group({
    from: this.fb.control('', [Validators.required]),
    to: this.fb.control('', [Validators.required]),
    date: this.fb.control<TuiDay>(TuiDay.currentUtc(), [Validators.required, dateValidator()]),
  });

  public ngOnInit() {
    const { from, to } = this.searchForm.controls;
    from.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.from.value) return;
      this.updateCities(this.from.value, 'from');
    });
    to.valueChanges.pipe(takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.to.value) return;
      this.updateCities(this.to.value, 'to');
    });
  }

  public updateCities(city: string, inputName: InputName) {
    const stationsArray = this.stations();
    if (!stationsArray) return;
    const receivedCities = stationsArray.filter((item) => item.city.toLowerCase().includes(city.toLowerCase()));
    this.searchService.setSearchCities(receivedCities);
    const receivedCity = receivedCities.find((item) => item.city === city);
    if (receivedCities.length === 0 || !receivedCity) return;
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

  public search() {
    if (this.searchForm.invalid) return;
    this.searchFilterService.setCarouselIndex(0);
    this.searchFilterService.setActiveTabIndex(0);
    let date = '';

    if (this.date.value) {
      const { day, month, year } = this.date.value;
      date = new Date(year, month, day).toISOString();
    }

    this.isLoading.set(true);
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
          this.isLoading.set(false);
          if (this.date.value) {
            const { day, month, year } = this.date.value;
            this.startDateWithoutTime = convertDateToISODateWithoutTime(new Date(Date.UTC(year, month, day)));
          }
          this.searchService.departureStation.set(response.from);
          this.searchService.arrivalStation.set(response.to);
          const sortedRidesWidthDepartureDate = findDepartureDatesOfRide(response);

          this.endDateWithoutTime = sortedRidesWidthDepartureDate.at(-1)?.departureDate ?? '';
          const dates = generateDates(this.startDateWithoutTime, this.endDateWithoutTime);

          const updatedDates = groupeRidesWithDates(dates, sortedRidesWidthDepartureDate);

          this.searchService.setfilterDates(updatedDates);
        },
        error: ({ error: { message } }) => {
          this.isLoading.set(false);
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
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
}
