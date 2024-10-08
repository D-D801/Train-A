import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { CarriagesService } from '@core/services/carriages/carriages.service';
import { StationsService } from '@core/services/stations/stations.service';
import { Price } from '@shared/interfaces/segment.interface';
import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
import { RideApiService } from '@features/admin/services/ride-api/ride-api.service';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { getCurrentDateTime } from '@shared/utils/getCurrentDateTime';
import { getISOStringDateTimeFromTuiDataTime } from '@shared/utils/getISOStringDateTimeFromTuiDataTime';
import { dateTimeValidator } from '@shared/validators/date-time.validator';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';

import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiAccordion, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import {
  TuiInputDateTimeModule,
  TuiInputNumberModule,
  TuiInputModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

interface TuiSegment {
  time: [[TuiDay, TuiTime], [TuiDay, TuiTime]];
  price: { [carriage: string]: number };
}

@Component({
  selector: 'dd-new-ride-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiCardLarge,
    TuiSurface,
    TuiTitle,
    TuiHeader,
    TuiAccordion,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    TuiButton,
    TuiInputModule,
    TuiError,
    AsyncPipe,
    TuiFieldErrorPipe,
    TuiCurrencyPipe,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './new-ride-form.component.html',
  styleUrl: './new-ride-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
})
export class NewRideFormComponent implements OnInit {
  public path = input.required<number[]>();

  public routeId = input.required<number>();

  public carriages = input.required<string[]>();

  public updateRouteInfo = output<number>();

  protected readonly stationsService = inject(StationsService);

  private readonly carriagesService = inject(CarriagesService);

  private readonly newRideService = inject(NewRideService);

  private readonly rideApiService = inject(RideApiService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  private readonly fb = inject(NonNullableFormBuilder);

  protected rideForm = this.fb.group({
    segments: this.fb.array<TuiSegment[]>([]),
  });

  protected minDate = getCurrentDateTime();

  public ngOnInit() {
    const segmentsArray = this.rideForm.get('segments') as FormArray;

    for (let i = 0; i < this.path().length - 1; i += 1) {
      const segmentGroup: FormGroup = this.fb.group({
        time: this.fb.array([
          this.fb.control<[TuiDay, TuiTime] | null>(null, dateTimeValidator()),
          this.fb.control<[TuiDay, TuiTime] | null>(null, dateTimeValidator()),
        ]),

        price: this.fb.group(
          this.carriages().reduce(
            (acc, carriage) => {
              return {
                ...acc,
                [carriage]: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
              };
            },
            {} as { [key: string]: FormControl<number | null> }
          )
        ),
      });

      segmentsArray.push(segmentGroup);
    }
  }

  protected onSubmit() {
    const newSegments = this.rideForm.value.segments;

    if (!newSegments) return;

    const segments = newSegments.map((segment) => {
      const price = Object.keys(segment.price).reduce((acc, key) => {
        acc[this.carriagesService.getCarriageCodeByName(key)] = segment.price[key];
        return acc;
      }, {} as Price);

      return {
        ...segment,
        price,
        time: [
          getISOStringDateTimeFromTuiDataTime(segment?.time[0]),
          getISOStringDateTimeFromTuiDataTime(segment?.time[1]),
        ] as [string, string],
      };
    });

    this.rideApiService
      .createNewRide(this.routeId(), { segments })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: ({ id }) => {
          this.alert.open({ message: `Ride ${id} successful created`, label: 'New ride', appearance: 'success' });
          this.newRideService.closeNewRideForm();
          this.updateRouteInfo.emit(this.routeId());
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
