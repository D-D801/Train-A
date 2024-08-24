import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { RouteFormComponent } from '@features/admin/components/route-form/route-form/route-form.component';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';

@Component({
  selector: 'dd-route-tab',
  standalone: true,
  imports: [RouteFormComponent, RouteCardComponent],
  templateUrl: './route-tab.component.html',
  styleUrl: './route-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteTabComponent {
  private readonly destroy = inject(DestroyRef);

  private readonly routeService = inject(RouteApiService);

  public readonly routes = signal<TrainRoute[]>([]);

  public constructor() {
    this.getRoutes()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((trainRoutes) => {
        this.routes.set(trainRoutes);
      });
  }

  public getRoutes() {
    return this.routeService.getRoute();
  }
}
