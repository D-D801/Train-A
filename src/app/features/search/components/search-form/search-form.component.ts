import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiDay, TuiLet, TuiTime } from '@taiga-ui/cdk';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { SearchService } from '@features/search/services/search.service';
import { merge, Subscription } from 'rxjs';
import { LocationApiService } from '@features/search/services/location-api.service';

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
        this.searchForm.controls.from.valueChanges.pipe(),
        this.searchForm.controls.to.valueChanges.pipe()
      ).subscribe(() => {
        if (!(this.from.value && this.to.value)) return;
        this.locationService.getLocationCoordinates(this.from.value).subscribe((value) => {
          this.fromInputValue = { lat: value[0].lat, lon: value[0].lon };
        });
        this.locationService.getLocationCoordinates(this.to.value).subscribe((value) => {
          this.toInputValue = { lat: value[0].lat, lon: value[0].lon };
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search() {
    console.error(
      this.date.value?.[0]?.day,
      this.date.value?.[0]?.month,
      this.date.value?.[0]?.year,
      this.date.value?.[1]?.hours,
      this.date.value?.[1]?.minutes
    );
    const res = this.searchService
      .search({
        fromLatitude: this.fromInputValue.lat,
        fromLongitude: this.fromInputValue.lon,
        toLatitude: this.toInputValue.lat,
        toLongitude: this.toInputValue.lon,
        time: 0,
      })
      .subscribe();
    console.error(res);
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
