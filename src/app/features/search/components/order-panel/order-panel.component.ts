import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { AuthService } from '@core/services/auth/auth.service';
import { SelectedOrder } from '@features/search/interfaces/selected-order.interface';
import { CURRENCY } from '@shared/constants/currency';
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

  private readonly router = inject(Router);

  protected open = signal(false);

  protected currency = CURRENCY;

  public constructor() {
    effect(
      () => {
        if (this.selectedOrder().seatNumber) {
          this.open.set(true);
        } else {
          this.open.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  public close() {
    this.open.set(false);
  }

  public handlerBookSeat() {
    if (this.authService.isLoggedIn()) {
      this.bookSeat.emit(this.selectedOrder());
    } else {
      this.alert.open({ message: 'No autorization', label: 'Error', appearance: 'error' });
      this.router.navigate(['/signin']);
    }
  }
}
