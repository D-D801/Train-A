import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { StationsService } from '@core/services/stations/stations.service';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { latitudeValidator } from '@features/admin/validators/latitude.validator';
import { longitudeValidator } from '@features/admin/validators/longitude.validator';
import { CityInfo } from '@features/search/interfaces/city-info.interface';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { LocationService } from '@features/search/services/location/location.service';
import { SearchService } from '@features/search/services/search/search.service';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiError } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { debounceTime, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-create-station-form',
  standalone: true,
  imports: [
    TuiLet,
    TuiInputModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    TuiButton,
    TuiDataList,
    NgIf,
    NgForOf,
    TuiError,
    AsyncPipe,
    TuiFieldErrorPipe,
    TitleCasePipe,
  ],
  templateUrl: './create-station-form.component.html',
  styleUrl: './create-station-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: { cityExist: 'Station in this city already exist' },
    },
  ],
})
export class CreateStationFormComponent implements OnInit {
  private readonly searchService = inject(SearchService);

  private readonly stationsApiService = inject(StationsApiService);

  private readonly stationsService = inject(StationsService);

  private readonly locationApiService = inject(LocationApiService);

  private readonly locationService = inject(LocationService);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);

  public readonly stations = this.stationsService.stations;

  public readonly city = this.locationService.city;

  public cities = this.searchService.cities;

  private readonly connectedStationValidator = (control: AbstractControl) => {
    if (!control.value) return null;
    return this.stationsService.stations()?.find((station) => station.city === control.value)
      ? null
      : { invalidConnectedStation: true };
  };

  public createdStationId: number = 0;

  public createStationForm = this.fb.group({
    cityName: this.fb.control('', [
      Validators.required,
      (control) =>
        this.stationsService.stations()?.find((station) => station.city === control.value) ? { cityExist: true } : null,
    ]),
    latitude: this.fb.control<number | null>(null, [Validators.required, latitudeValidator()]),
    longitude: this.fb.control<number | null>(null, [Validators.required, longitudeValidator()]),
    connectedStations: this.fb.array([this.fb.control('', [Validators.required, this.connectedStationValidator])]),
  });

  public constructor() {
    effect(() => {
      const city = this.city();
      if (city && this.locationService.isClickedMap()) {
        this.controls.cityName.setValue(city.title);
        this.controls.latitude.setValue(city.coordinates.lat);
        this.controls.longitude.setValue(city.coordinates.lng);
      }
    });
  }

  // TODO: place the retrieveStationList method in another location in code
  public ngOnInit() {
    this.controls.connectedStations.valueChanges
      .pipe(
        tap(() => {
          if (this.controls.connectedStations.controls[this.controls.connectedStations.length - 1]?.valid) {
            this.setUniqueConnectedStationsList();
          }
        }),
        filter(() => this.controls.connectedStations?.at(-1)?.value !== ''),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe(() => {
        if (this.controls.connectedStations.controls[this.controls.connectedStations.length - 1]?.valid) {
          this.controls.connectedStations.push(this.fb.control('', [this.connectedStationValidator]));
        }
      });

    this.controls.cityName.valueChanges
      .pipe(
        debounceTime(300),
        filter((city) => !!city),
        switchMap((city) => {
          return this.locationApiService.getLocationCoordinates(city as string);
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (receivedCities) => {
          this.searchService.setCities(receivedCities);
          this.setNewCityWithCoordinates();
        },
      });
    this.controls.latitude.valueChanges.pipe(debounceTime(500), takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.setNewCityWithCoordinates();
      },
    });
    this.controls.longitude.valueChanges.pipe(debounceTime(500), takeUntilDestroyed(this.destroy)).subscribe({
      next: () => {
        this.setNewCityWithCoordinates();
      },
    });
  }

  private setNewCityWithCoordinates() {
    this.locationService.setIsClickedMap(false);
    const { latitude, longitude } = this.createStationForm.controls;
    if (!latitude.value || !longitude.value) return;
    const cityWithCoordinates = {
      title: this.createStationForm.controls.cityName.value,
      coordinates: {
        lat: latitude.value,
        lng: longitude.value,
      },
    };
    this.locationService.setCitySignal(cityWithCoordinates);
  }

  private setUniqueConnectedStationsList() {
    const connectedStations = this.controls.connectedStations.value;

    const uniqueConnectedStations = Array.from(new Set(connectedStations.filter((station) => station !== '')));

    this.locationService.setConnectedStationList(uniqueConnectedStations);
  }

  public onSelectedCity(city: CityInfo) {
    this.controls.latitude.setValue(city.lat);
    this.controls.longitude.setValue(city.lon);
  }

  public createStation() {
    const relations = [
      ...new Set(
        this.createStationForm.controls.connectedStations.controls
          .map((item) => this.stationsService.getStationIdByName(item.value))
          .filter((item) => item != null)
      ),
    ];

    if (!this.createStationForm.valid) return;
    if (!this.controls.cityName.value || !this.controls.latitude.value || !this.controls.longitude.value) return;
    const body: NewStation = {
      city: this.controls.cityName.value,
      latitude: this.controls.latitude.value,
      longitude: this.controls.longitude.value,
      relations: relations as number[],
    };
    this.stationsApiService
      .createNewStation(body)
      .pipe(
        tap(({ id }) => {
          this.createdStationId = id;
        }),
        switchMap(() => this.stationsApiService.getStations()),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (stations) => {
          this.stationsService.addStationInList(stations);
          this.resetForm();
          this.locationService.setCitySignal(null);
          this.locationService.setConnectedStationList([]);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  public get controls() {
    return this.createStationForm.controls;
  }

  public resetForm() {
    this.createStationForm.reset();
    const connectedStations = this.createStationForm.get('connectedStations') as FormArray;
    connectedStations.clear();
    connectedStations.push(this.fb.control('', [Validators.required, this.connectedStationValidator]));
  }
}
