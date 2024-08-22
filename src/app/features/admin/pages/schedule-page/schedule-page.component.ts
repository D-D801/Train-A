import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'dd-schedule-page',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {
  private readonly routeApiService = inject(RouteApiService);

  public constructor() {
    this.routeApiService.getRoute(17).subscribe();
  }
}
