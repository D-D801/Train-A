import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { SelectedOrder } from '@features/search/services/trip/trip.service';
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

  public isBookSeat = input.required<boolean>();

  public bookSeat = output<SelectedOrder>();

  private readonly authService = inject(AuthService);

  private readonly alert = inject(AlertService);

  public isLoggedIn = this.authService.isLoggedIn;

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
    if (this.isLoggedIn()) {
      this.bookSeat.emit(this.selectedOrder());
    } else {
      this.alert.open({ message: 'No autorization', label: 'Error', appearance: 'error' });
    }
  }
}
