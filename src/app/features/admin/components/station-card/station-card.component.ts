import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { Segment } from '@features/admin/interfaces/segment.interface';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS, TuiAccordion } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import {
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { RideApiService } from '@features/admin/services/ride-api/ride-api.service';
import { dateTimeValidator } from '@shared/validators/date-time.validator';
import { buildInErrors } from '@shared/constants/build-in-errors';
import { getISOStringDateTimeFromTuiDataTime } from '@shared/utils/getISOStringDateTimeFromTuiDataTime';
import { EditableFormComponent } from '@shared/components/editable-form/editable-form.component';

@Component({
  selector: 'dd-station-card',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiSurface,
    TuiTitle,
    TuiHeader,
    TuiInputModule,
    TuiError,
    ReactiveFormsModule,
    TuiButton,
    TuiInputModule,
    TuiIcon,
    TuiAccordion,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    KeyValuePipe,
    TitleCasePipe,
    TuiCurrencyPipe,
    TuiTextfieldControllerModule,
    EditableFormComponent,
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: buildInErrors,
    },
  ],
})
export class StationCardComponent {
  public ids = input.required<{ routeId: number; rideId: number }>();

  public currentSegmentIndex = input.required<number>();

  public segments = input.required<Segment[]>();

  public station = input.required<[number, number]>();

  public readonly rideApiService = inject(RideApiService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  private readonly fb = inject(FormBuilder);

  public save = () => this.saveSegment();

  protected timeForm = this.fb.group({
    departure: this.fb.control<[TuiDay, TuiTime] | null>(null, dateTimeValidator()),
    arrival: this.fb.control<[TuiDay, TuiTime] | null>(null, dateTimeValidator()),
  });

  protected priceForm = this.fb.group({});

  public constructor() {
    effect(() => {
      const segments = this.segments();
      if (!segments) return;

      const segment = segments[this.currentSegmentIndex()];

      const { time, price } = segment;

      const departure = new Date(time[0]);
      const arrival = new Date(time[1]);

      const departureTime = new TuiTime(departure.getHours(), departure.getMinutes());
      const arrivalTime = new TuiTime(arrival.getHours(), arrival.getMinutes());

      this.timeForm.patchValue({
        departure: [TuiDay.fromLocalNativeDate(departure), departureTime],
        arrival: [TuiDay.fromLocalNativeDate(arrival), arrivalTime],
      });

      Object.keys(price).forEach((carriage) => {
        if (this.priceForm.contains(carriage)) {
          this.priceForm.get(carriage)?.setValue(price[carriage]);
          return;
        }
        this.priceForm.addControl(carriage, this.fb.control(price[carriage], [Validators.required, Validators.min(0)]));
      });
    });
  }

  public saveSegment() {
    if (this.timeForm.invalid && this.priceForm.invalid) return;
    const segments = this.segments();
    if (!segments) return;

    const { routeId, rideId } = this.ids();
    const { departure, arrival } = this.timeForm.value;
    const price = this.priceForm.value;

    if (!(departure && arrival && price)) return;

    const departureDate = getISOStringDateTimeFromTuiDataTime(departure);
    const arrivalDate = getISOStringDateTimeFromTuiDataTime(arrival);

    if (!(departureDate && arrivalDate)) return;

    segments[this.currentSegmentIndex()] = {
      time: [departureDate, arrivalDate],
      price,
    };

    this.rideApiService
      .updateRide(routeId, rideId, {
        segments,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
