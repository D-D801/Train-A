import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  public segment = input.required<Segment>();

  private readonly fb = inject(FormBuilder);

  protected timeForm = this.fb.group({
    from: this.fb.control<[TuiDay | null, TuiTime | null]>([new TuiDay(2017, 2, 15), new TuiTime(12, 30)]),
    to: this.fb.control<[TuiDay | null, TuiTime | null]>([new TuiDay(2017, 2, 15), new TuiTime(12, 30)]),
  });

  // eslint-disable-next-line class-methods-use-this
  public onSave = () => {};

  protected city = 'London';
}
