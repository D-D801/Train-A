import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiDay, TuiLet, TuiTime } from '@taiga-ui/cdk';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { SearchService } from '@features/search/services/search/search.service';
import { debounceTime, Subscription } from 'rxjs';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { CityInfo } from '@features/search/interfaces/city-info';
import { dateValidator } from '@features/search/validators/date';

interface CityCoordinates {
  latitude: number;
  longitude: number;
}

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
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);

  private locationService = inject(LocationApiService);

  private subscription = new Subscription();

  cities = this.searchService.cities;

  private fromCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private toCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  selectedCityIndex: number = 0;

  searchForm = new FormGroup({
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
    date: new FormControl<[TuiDay, TuiTime]>([TuiDay.currentUtc(), new TuiTime(0, 0)], dateValidator()),
  });

  ngOnInit(): void {
    const { from, to } = this.searchForm.controls;
    this.subscription.add(
      from.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
        if (!this.from.value) return;
        this.updateCities(this.from.value, 'from');
      })
    );
    this.subscription.add(
      to.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
        if (!this.to.value) return;
        this.updateCities(this.to.value, 'to');
      })
    );
  }

  updateCities(city: string, inputName: InputName) {
    this.locationService.getLocationCoordinates(city).subscribe((receivedCities) => {
      const { lat, lon } = receivedCities[this.selectedCityIndex];
      if (inputName === 'from') {
        this.fromCityCoordinates = {
          latitude: lat,
          longitude: lon,
        };
      } else {
        this.toCityCoordinates = {
          latitude: lat,
          longitude: lon,
        };
      }
      this.searchService.setCities(receivedCities);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(city: CityInfo, inputName: string, index: number) {
    this.selectedCityIndex = index;
    if (inputName === 'from') {
      this.from.setValue(city.name);
    }
    if (inputName === 'to') {
      this.to.setValue(city.name);
    }
  }

  search() {
    if (this.searchForm.invalid) return;
    let date = 0;
    if (this.date.value) {
      const [{ day, month, year }, { hours, minutes }] = this.date.value;
      date = new Date(day, month, year, hours, minutes).valueOf();
    }
    this.subscription.add(
      this.searchService
        .search({
          fromLatitude: this.fromCityCoordinates.latitude,
          fromLongitude: this.fromCityCoordinates.longitude,
          toLatitude: this.toCityCoordinates.latitude,
          toLongitude: this.toCityCoordinates.longitude,
          time: date,
        })
        .subscribe()
    );
  }

  get from() {
    return this.searchForm.controls.from;
  }

  get to() {
    return this.searchForm.controls.to;
  }

  get date() {
    return this.searchForm.controls.date;
  }
}
