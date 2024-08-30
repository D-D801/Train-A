import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { Station } from '@features/admin/interfaces/station-list-item.interface';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { StationsService } from '@features/admin/services/stations/stations.service';
import { latitudeValidator } from '@features/admin/validators/latitude.validator';
import { longitudeValidator } from '@features/admin/validators/longitude.validator';
import { CityInfo } from '@features/search/interfaces/city-info.interface';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { SearchService } from '@features/search/services/search/search.service';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-create-station-form',
  standalone: true,
  imports: [TuiLet, TuiInputModule, ReactiveFormsModule, NgTemplateOutlet, TuiButton, TuiDataList, NgIf, NgForOf],
  templateUrl: './create-station-form.component.html',
  styleUrl: './create-station-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationFormComponent implements OnInit {
  private readonly searchService = inject(SearchService);

  private readonly stationsApiService = inject(StationsApiService);

  private readonly stationsService = inject(StationsService);

  private readonly locationService = inject(LocationApiService);

  public cities = this.searchService.cities;

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(FormBuilder);

  public readonly stations = this.stationsService.stations;

  public relations: number[] = [];

  public createdStationId: number = 0;

  public createStationForm = this.fb.group({
    cityName: this.fb.control('', Validators.required),
    latitude: this.fb.control<number | null>(null, [Validators.required, latitudeValidator()]),
    longitude: this.fb.control<number | null>(null, [Validators.required, longitudeValidator()]),
    connectedStations: this.fb.array([this.fb.control('', Validators.required)]),
  });

  // TODO: place the retrieveStationList method in another location in code
  public ngOnInit() {
    this.connectedStations.valueChanges
      .pipe(
        debounceTime(1000),
        filter(() => this.connectedStations.at(this.connectedStations.length - 1).value !== ''),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe(() => {
        this.connectedStations.controls[this.connectedStations.length - 1].addValidators(Validators.required);
        this.connectedStations.push(this.createConnectedStationControl());
      });

    this.cityName.valueChanges
      .pipe(
        debounceTime(1000),
        filter((city) => city !== null),
        switchMap((city) => {
          return this.locationService.getLocationCoordinates(city as string);
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (receivedCities) => {
          this.searchService.setCities(receivedCities);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error:', appearance: 'error' });
        },
      });
  }

  private createConnectedStationControl() {
    return this.fb.control('');
  }

  public onSelectedCity(city: CityInfo) {
    this.latitude.setValue(city.lat);
    this.longitude.setValue(city.lon);
  }

  public onSelected(station: Station, index: number) {
    if (this.relations.includes(index)) return;
    this.connectedStations.controls[index].setValue(station.city);
    this.relations[index] = station.id;
  }

  public createStation() {
    if (!this.createStationForm.valid) return;
    if (this.stationsService.stations()?.find((station) => station.city === this.cityName.value)) return;
    if (!this.cityName.value || !this.latitude.value || !this.longitude.value) return;
    const body: NewStation = {
      city: this.cityName.value,
      latitude: this.latitude.value,
      longitude: this.longitude.value,
      relations: this.relations,
    };
    this.stationsApiService
      .createNewStation(body)
      .pipe(
        tap(({ id }) => {
          this.createdStationId = id;
        }),
        switchMap(() => this.stationsApiService.retrieveStationList()),
        map((stations) => stations.find((station) => station.id === this.createdStationId)),
        filter((station) => station !== undefined),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (createdStation) => {
          if (!createdStation) return;
          this.stationsService.addStationInList(createdStation);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public get controls() {
    return this.createStationForm.controls;
  }

  public get connectedStations() {
    return this.controls.connectedStations;
  }

  public get cityName() {
    return this.controls.cityName;
  }

  public get latitude() {
    return this.controls.latitude;
  }

  public get longitude() {
    return this.controls.longitude;
  }
}
