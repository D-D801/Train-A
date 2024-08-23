import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() public carriage!: Carriage;

  @Output() public editCarriage = new EventEmitter<Carriage>();

  public onEdit(carriage: Carriage) {
    this.editCarriage.emit(carriage);
  }
}
