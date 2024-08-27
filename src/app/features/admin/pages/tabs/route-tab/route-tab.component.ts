import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { RouteFormComponent } from '@features/admin/components/route-form/route-form/route-form.component';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton, TuiSurface } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'dd-route-tab',
  standalone: true,
  imports: [RouteFormComponent, RouteCardComponent, TuiCardLarge, TuiSurface, TuiButton],
  templateUrl: './route-tab.component.html',
  styleUrl: './route-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteTabComponent {
  private readonly destroy = inject(DestroyRef);

  private readonly routeService = inject(RouteApiService);

  public readonly routes = signal<TrainRoute[]>([]);

  public readonly currentRouteId = signal<number | null>(null);

  public readonly isEdit = signal(false);

  public constructor() {
    this.getRoutes();
  }

  public getRoutes() {
    return this.routeService
      .getRoute()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((trainRoutes) => {
        this.routes.set(trainRoutes.slice(0, 3));
      });
  }

  public onEdit(id: number | undefined) {
    if (!id) return;
    this.currentRouteId.set(id - 1);
    this.isEdit.set(true);
  }

  public onSave() {
    this.isEdit.set(false);
    this.getRoutes();
  }

  public onCreate() {
    this.currentRouteId.set(null);
    this.isEdit.set(true);
  }
}
