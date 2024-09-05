import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { Station } from '@features/admin/interfaces/station-list-item.interface';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { latitudeValidator } from '@features/admin/validators/latitude.validator';
import { longitudeValidator } from '@features/admin/validators/longitude.validator';
import { CityInfo } from '@features/search/interfaces/city-info.interface';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { SearchService } from '@features/search/services/search/search.service';
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiError } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { StationsService } from '@core/services/stations/stations.service';

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

  private readonly locationService = inject(LocationApiService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly fb = inject(FormBuilder);

  public readonly stations = this.stationsService.stations;

  public cities = this.searchService.cities;

  private readonly connectedStationValidator = (control: AbstractControl) =>
    this.stationsService.stations()?.find((station) => station.city === control.value)
      ? null
      : { invalidConnectedStation: true };

  public relations: number[] = [];

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

  // TODO: place the retrieveStationList method in another location in code
  public ngOnInit() {
    this.controls.connectedStations.valueChanges
      .pipe(
        filter(() => this.controls.connectedStations.at(-1).value !== ''),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe(() => {
        this.cdr.detectChanges();
        if (this.controls.connectedStations.length !== 1) {
          this.controls.connectedStations.controls[this.controls.connectedStations.length - 1].addValidators([
            Validators.required,
            this.connectedStationValidator,
          ]);
        }
        if (this.controls.connectedStations.controls[this.controls.connectedStations.length - 1].valid) {
          this.controls.connectedStations.push(this.createConnectedStationControl());
        }
      });

    this.controls.cityName.valueChanges
      .pipe(
        debounceTime(300),
        filter((city) => !!city),
        switchMap((city) => {
          return this.locationService.getLocationCoordinates(city as string);
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: (receivedCities) => {
          this.searchService.setCities(receivedCities);
        },
      });
  }

  private createConnectedStationControl() {
    return this.fb.control('');
  }

  public onSelectedCity(city: CityInfo) {
    this.controls.latitude.setValue(city.lat);
    this.controls.longitude.setValue(city.lon);
  }

  public onSelected(station: Station, index: number) {
    if (index >= 0 && index < this.relations.length) return;
    this.controls.connectedStations.controls[index].setValue(station.city);
    this.relations[index] = station.id;
  }

  public createStation() {
    if (!this.createStationForm.valid) return;
    if (!this.controls.cityName.value || !this.controls.latitude.value || !this.controls.longitude.value) return;
    const body: NewStation = {
      city: this.controls.cityName.value,
      latitude: this.controls.latitude.value,
      longitude: this.controls.longitude.value,
      relations: this.relations,
    };
    this.stationsApiService
      .createNewStation(body)
      .pipe(
        tap(({ id }) => {
          this.createdStationId = id;
        }),
        switchMap(() => this.stationsApiService.getStations()),
        map((stations) => stations.find((station) => station.id === this.createdStationId)),
        filter((station) => !station),
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
}
