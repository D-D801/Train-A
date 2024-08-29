import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { SelectedOrder } from '@features/search/services/ride/ride.service';
import { TuiButton } from '@taiga-ui/core';
import { TuiPush, TuiPushDirective } from '@taiga-ui/kit';

@Component({
  selector: 'dd-order-panel',
  standalone: true,
  imports: [TuiPush, TuiPushDirective, TuiButton],
  templateUrl: './order-panel.component.html',
  styleUrl: './order-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPanelComponent {
  public selectedOrder = input.required<SelectedOrder>();

  public bookSeat = output<boolean>();

  protected open = signal(false);

  public constructor() {
    effect(
      () => {
        if (this.selectedOrder().seatNumber) {
          this.open.set(true);
        }
      },
      { allowSignalWrites: true }
    );
  }

  public close() {
    this.open.set(false);
  }

  public hendlerBookSeat() {
    this.bookSeat.emit(true);
  }
}
