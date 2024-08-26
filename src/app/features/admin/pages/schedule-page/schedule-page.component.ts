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
  protected routeId = 13;

  private readonly routeApiService = inject(RouteApiService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  protected routeInformation = toSignal(
    this.routeApiService.getRoute(this.routeId).pipe(
      tap({
        // next: ({ path, schedule }) => console.log(path, schedule),
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      }),
      takeUntilDestroyed(this.destroy)
    )
  );
}
