import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { TuiButton, TuiDialogService, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TUI_CONFIRM, TuiAccordion } from '@taiga-ui/kit';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { RideApiService } from '@features/admin/services/ride-api/ride-api.service';
import { getDeletionConfirmationData } from '@shared/utils/getDeletionConfirmationData';
import { Schedule } from '@shared/interfaces/schedule.interface';
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

  public updateRouteInfo = output<number>();

  private readonly rideApiService = inject(RideApiService);

  private readonly dialogs = inject(TuiDialogService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  public deleteRide(event: MouseEvent) {
    event.stopPropagation();

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Delete ${this.ride().rideId} ride`,
        size: 'm',
        data: getDeletionConfirmationData(`ride`),
      })
      .pipe(
        filter((isConfirmed) => isConfirmed),
        switchMap(() => this.rideApiService.deleteRide(this.routeId(), this.ride().rideId)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: () => {
          this.updateRouteInfo.emit(this.routeId());
          this.alert.open({
            message: `Ride ${this.ride().rideId} successful deleted.`,
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
