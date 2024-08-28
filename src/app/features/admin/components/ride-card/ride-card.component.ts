import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, input, Output } from '@angular/core';
import { TuiButton, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Schedule } from '@features/admin/interfaces/schedule.interface';
import { TuiAccordion } from '@taiga-ui/kit';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
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

  @Output() public delete = new EventEmitter<number>();

  private readonly routeApiService = inject(RouteApiService);

  public readonly destroy = inject(DestroyRef);

  public readonly alert = inject(AlertService);

  protected deleteRide(event: MouseEvent) {
    event.stopPropagation();
    this.routeApiService
      .deleteRide(this.routeId(), this.ride().rideId)
      .pipe(
        tap({
          next: () => {
            this.delete.emit(this.ride().rideId);
          },
          error: ({ error: { message } }) => {
            this.alert.open({ message, label: 'Error', appearance: 'error' });
          },
        }),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }
}
