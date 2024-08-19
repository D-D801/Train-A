import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiDay, TuiLet, TuiTime } from '@taiga-ui/cdk';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { SearchService } from '@features/search/services/search/search.service';
import { debounceTime, merge, Subscription } from 'rxjs';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { CityInfo } from '@features/search/interfaces/city-info';

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

  cities$ = this.searchService.cities;

  private fromInputValue: { lat: number; lon: number } = { lat: 0, lon: 0 };

  private toInputValue: { lat: number; lon: number } = { lat: 0, lon: 0 };

  searchForm = new FormGroup({
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
    date: new FormControl<[TuiDay, TuiTime]>([new TuiDay(2017, 2, 15), new TuiTime(12, 30)]),
  });

  ngOnInit(): void {
    this.subscription.add(
      merge(
        this.searchForm.controls.from.valueChanges.pipe(debounceTime(1000)),
        this.searchForm.controls.to.valueChanges.pipe(debounceTime(1000))
      ).subscribe(() => {
        if (!this.from.value) return;
        this.updateCities(this.from.value, 'from');
        if (!this.to.value) return;
        this.updateCities(this.to.value, 'to');
      })
    );
  }

  updateCities(city: string, inputName: string) {
    this.locationService.getLocationCoordinates(city).subscribe((value) => {
      if (inputName === 'from') {
        this.fromInputValue = { lat: value[0].lat, lon: value[0].lon };
      } else {
        this.toInputValue = { lat: value[0].lat, lon: value[0].lon };
      }
      this.searchService.setCities(value);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(city: CityInfo, inputName: string) {
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
      const { day, month, year } = this.date.value[0];
      const { hours, minutes } = this.date.value[1];
      date = new Date(day, month, year, hours, minutes).valueOf();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const searchServiceResponse = this.searchService
      .search({
        fromLatitude: this.fromInputValue.lat,
        fromLongitude: this.fromInputValue.lon,
        toLatitude: this.toInputValue.lat,
        toLongitude: this.toInputValue.lon,
        time: date,
      })
      .subscribe();
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
