import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { RouteFormComponent } from '@features/admin/components/route-form/route-form/route-form.component';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TuiButton, TuiDialogService, TuiLoader, tuiLoaderOptionsProvider, TuiSurface } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-route-tab',
  standalone: true,
  imports: [RouteFormComponent, RouteCardComponent, TuiCardLarge, TuiSurface, TuiButton, TuiLoader],
  providers: [
    tuiLoaderOptionsProvider({
      size: 'xl',
      inheritColor: false,
      overlay: true,
    }),
  ],
  templateUrl: './route-tab.component.html',
  styleUrl: './route-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteTabComponent {
  private readonly dialogs = inject(TuiDialogService);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly routeService = inject(RouteApiService);

  public readonly routes = signal<TrainRoute[]>([]);

  public readonly currentRoute = signal<TrainRoute | null>(null);

  public readonly isEdit = signal(false);

  public readonly isLoading = signal(false);

  public constructor() {
    this.updateRoutes().subscribe();
  }

  public updateRoutes() {
    this.isLoading.set(true);
    return this.routeService.getRoutes().pipe(
      tap((trainRoutes) => {
        this.routes.set(trainRoutes);
        this.isLoading.set(false);
      }),
      takeUntilDestroyed(this.destroy)
    );
  }

  public onEdit(currentRoute: TrainRoute | undefined) {
    if (!currentRoute) return;
    this.currentRoute.set(currentRoute);
    this.isEdit.set(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  public onSave() {
    this.isEdit.set(false);
    this.updateRoutes().subscribe();
  }

  public onCreate() {
    this.currentRoute.set(null);
    this.isEdit.set(true);
  }

  public onDelete(route: TrainRoute | undefined) {
    if (!route) return;
    const data: TuiConfirmData = {
      content: 'Do you really want to delete this route ?',
      yes: 'Delete',
      no: 'Cancel',
      appearance: 'accent',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Delete ${route.id} route.`,
        size: 's',
        data,
      })
      .pipe(
        filter((response) => response),
        switchMap(() => this.routeService.deleteRoute(route)),
        switchMap(() => this.updateRoutes()),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: () => {
          this.currentRoute.set(null);
          this.isEdit.set(false);
          this.alert.open({
            message: `Route ${route.id} successful deleted.`,
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
