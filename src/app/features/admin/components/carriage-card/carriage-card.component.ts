import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiButton, TuiSurface, TuiTitle } from '@taiga-ui/core';
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
