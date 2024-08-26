import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Segment } from '@features/admin/interfaces/segment.interface';
import { TextSwitchFormComponent } from '@shared/components/text-switch-form/text-switch-form.component';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiSurface, TuiTitle } from '@taiga-ui/core';
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
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationCardComponent {
  public station = input.required<number>();

  public segment = input<Segment>();

  private readonly fb = inject(FormBuilder);

  protected timeForm = this.fb.group({
    departure: this.fb.control<[TuiDay, TuiTime] | []>([]),
    arrival: this.fb.control<[TuiDay, TuiTime] | []>([]),
  });

  protected priceForm = this.fb.group({});

  public constructor() {
    effect(() => {
      const segment = this.segment();

      if (!segment) return;

      const { time, price } = segment;

      const departure = new Date(time[0]);
      const arrival = new Date(time[1]);

      const departureTime = new TuiTime(departure.getHours(), departure.getMinutes());
      const arrivalTime = new TuiTime(arrival.getHours(), arrival.getMinutes());

      this.timeForm.setValue({
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

  // eslint-disable-next-line class-methods-use-this
  public onSave = () => {};
}
