import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';
import { tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { RideCardComponent } from '../../components/ride-card/ride-card.component';

@Component({
  selector: 'dd-schedule-page',
  standalone: true,
  imports: [TuiButton, RideCardComponent, AsyncPipe, NgFor],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {
  private readonly routeApiService = inject(RouteApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  protected routeInfo = toSignal(
    this.routeApiService.getRoute(17).pipe(
      tap({
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      }),
      takeUntilDestroyed(this.destroy)
    )
  );
}
