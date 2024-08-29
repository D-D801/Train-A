import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { TuiButton, TuiDialogService, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Schedule } from '@features/admin/interfaces/schedule.interface';
import { TUI_CONFIRM, TuiAccordion, TuiConfirmData } from '@taiga-ui/kit';
import { filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { RideApiService } from '@features/admin/services/ride-api/ride-api.service';
import { getDeletionConfirmationData } from '@features/admin/utils/getDeletionConfirmationData';
import { StationCardComponent } from '../station-card/station-card.component';

@Component({
  selector: 'dd-ride-card',
  standalone: true,
  imports: [TuiCardLarge, TuiSurface, TuiTitle, TuiHeader, StationCardComponent, TuiAccordion, TuiButton],
  templateUrl: './ride-card.component.html',
  styleUrl: './ride-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideCardComponent {
  public ride = input.required<Schedule>();

  public routeId = input.required<number>();

  public path = input.required<number[]>();

  public delete = output<number>();

  private readonly rideApiService = inject(RideApiService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  private readonly dialogs = inject(TuiDialogService);

  protected deleteRide(event: MouseEvent) {
    event.stopPropagation();

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Delete ride',
        size: 's',
        data: getDeletionConfirmationData('ride'),
      })
      .pipe(
        filter((isDelete) => isDelete),
        switchMap(() => this.rideApiService.deleteRide(this.routeId(), this.ride().rideId)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: () => {
          this.delete.emit(this.ride().rideId);
          this.alert.open({
            message: `Ride${this.ride().rideId} successful deleted.`,
            label: 'Delete',
            appearance: 'success',
          });
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
