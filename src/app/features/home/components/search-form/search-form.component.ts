import { AsyncPipe, NgIf, NgForOf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiDay, TuiLet, TuiTime } from '@taiga-ui/cdk';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { SearchService } from '@features/home/services/search/search.service';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationApiService } from '@features/home/services/location-api/location-api.service';
import { dateValidator } from '@features/home/validators/date';
import { SearchApiService } from '@features/home/services/search-api/search-api.service';
import { CityCoordinates } from '@features/home/interfaces/city-coordinates.interface';
import { CityInfo } from '@features/home/interfaces/city-info.interface';

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
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  private readonly searchService = inject(SearchService);

  private readonly searchApiService = inject(SearchApiService);

  private readonly fb = inject(FormBuilder);

  private readonly locationService = inject(LocationApiService);

  private readonly destroy = inject(DestroyRef);

  public cities = this.searchService.cities;

  private fromCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private toCityCoordinates: CityCoordinates = { latitude: 0, longitude: 0 };

  private selectedCityIndex: number = 0;

  public searchForm = this.fb.group({
    from: this.fb.control('', [Validators.required]),
    to: this.fb.control('', [Validators.required]),
    date: this.fb.control<[TuiDay, TuiTime]>([TuiDay.currentUtc(), new TuiTime(0, 0)], dateValidator()),
  });

  public ngOnInit() {
    const { from, to } = this.searchForm.controls;
    from.valueChanges.pipe(debounceTime(1000), takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.from.value) return;
      this.updateCities(this.from.value, 'from');
    });
    to.valueChanges.pipe(debounceTime(1000), takeUntilDestroyed(this.destroy)).subscribe(() => {
      if (!this.to.value) return;
      this.updateCities(this.to.value, 'to');
    });
  }

  public updateCities(city: string, inputName: InputName) {
    this.locationService
      .getLocationCoordinates(city)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((receivedCities) => {
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

  public onSelected(city: CityInfo, inputName: string, index: number) {
    this.selectedCityIndex = index;
    if (inputName === 'from') {
      this.from.setValue(city.name);
    }
    if (inputName === 'to') {
      this.to.setValue(city.name);
    }
  }

  public search() {
    if (this.searchForm.invalid) return;
    let date = 0;
    if (this.date.value) {
      const [{ day, month, year }, { hours, minutes }] = this.date.value;
      date = new Date(day, month, year, hours, minutes).valueOf();
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
      .subscribe();
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
