import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiButton, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { Carriage } from '@shared/interfaces/carriage.interface';
import { CarriagePreviewComponent } from '../carriage-preview/carriage-preview.component';

@Component({
  selector: 'dd-carriage-card',
  standalone: true,
  imports: [CarriagePreviewComponent, TuiCardLarge, TuiSurface, TuiTitle, TuiHeader, TuiButton],
  templateUrl: './carriage-card.component.html',
  styleUrl: './carriage-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriageCardComponent {
  public carriage = input.required<Carriage>();

  public editCarriage = output<Carriage>();

  public onEdit(carriage: Carriage) {
    this.editCarriage.emit(carriage);
  }
}
