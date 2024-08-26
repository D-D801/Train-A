import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@core/services/alert/alert.service';
import { Segment } from '@features/admin/interfaces/segment.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TextSwitchFormComponent } from '@shared/components/text-switch-form/text-switch-form.component';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiIcon, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiInputModule } from '@taiga-ui/legacy';

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
    TextSwitchFormComponent,
    TuiInputModule,
    TuiIcon,
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationCardComponent {
  public station = input.required<[number, number]>();

  public segments = input<{ segments: Segment[]; index: number }>();

  public ids = input.required<{ routeId: number; rideId: number }>();

  public readonly routeApiService = inject(RouteApiService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  private readonly fb = inject(FormBuilder);

  public save = () => this.saveSegment();

  protected timeForm = this.fb.group({
    departure: this.fb.control<[TuiDay, TuiTime] | []>([]),
    arrival: this.fb.control<[TuiDay, TuiTime] | []>([]),
  });

  protected priceForm = this.fb.group({});

  public constructor() {
    effect(() => {
      const segments = this.segments();
      if (!segments) return;

      const segment = segments.segments[segments.index];

      const { time, price } = segment;

      const departure = new Date(time[0]);
      const arrival = new Date(time[1]);

      const departureTime = new TuiTime(departure.getHours(), departure.getMinutes());
      const arrivalTime = new TuiTime(arrival.getHours(), arrival.getMinutes());

      this.timeForm.patchValue({
        departure: [TuiDay.fromLocalNativeDate(departure), departureTime],
        arrival: [TuiDay.fromLocalNativeDate(arrival), arrivalTime],
      });

      const priceControls = Object.keys(price).reduce(
        (acc, key) => {
          acc[key] = this.fb.control(price[key]);
          return acc;
        },
        {} as { [key: string]: FormControl<number | null> }
      );

      this.priceForm = this.fb.group(priceControls);
    });
  }

  public saveSegment() {
    const segments = this.segments();
    if (!segments) return;

    const { routeId, rideId } = this.ids();
    const { departure, arrival } = this.timeForm.value;
    const price = this.priceForm.value;

    if (!(departure && arrival && price)) return;

    const departureString = new Date(departure.toString()).toISOString();
    const arrivalString = new Date(arrival.toString()).toISOString();

    segments.segments[segments.index] = {
      time: [departureString, arrivalString],
      price,
    };

    this.routeApiService
      .updateRide(routeId, rideId, {
        segments: segments.segments,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe();
  }
}
