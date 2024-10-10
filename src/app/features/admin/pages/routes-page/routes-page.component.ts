import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '@core/services/alert/alert.service';
import { RouteCardComponent } from '@features/admin/components/route-card/route-card.component';
import { RouteFormComponent } from '@features/admin/components/route-form/route-form.component';
import { RouteApiService } from '@features/admin/services/route-api/route-api.service';
import { TrainRoute } from '@shared/interfaces/train-route.interface';
import { getDeletionConfirmationData } from '@shared/utils/getDeletionConfirmationData';
import { TuiButton, TuiDialogService, TuiLoader, tuiLoaderOptionsProvider, TuiSurface } from '@taiga-ui/core';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { filter, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'dd-routes-page',
  standalone: true,
  imports: [RouteFormComponent, RouteCardComponent, TuiCardLarge, TuiSurface, TuiButton, TuiLoader],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.scss',
  providers: [
    tuiLoaderOptionsProvider({
      size: 'xl',
      inheritColor: false,
      overlay: true,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesPageComponent implements OnInit {
  private readonly dialogs = inject(TuiDialogService);

  private readonly alert = inject(AlertService);

  private readonly destroy = inject(DestroyRef);

  private readonly routeApiService = inject(RouteApiService);

  public readonly routes = signal<TrainRoute[]>([]);

  public readonly currentRoute = signal<TrainRoute | null>(null);

  public readonly isEdit = signal(false);

  public readonly isLoading = signal(false);

  private readonly action$$ = new Subject();

  public ngOnInit() {
    this.action$$
      .pipe(
        tap(() => {
          this.isLoading.set(true);
        }),
        switchMap(() =>
          this.routeApiService.getRoutes().pipe(
            tap((trainRoutes) => {
              this.routes.set(trainRoutes);
              this.isLoading.set(false);
            })
          )
        ),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
    this.action$$.next('');
  }

  public onEdit(currentRoute: TrainRoute) {
    this.currentRoute.set(currentRoute);
    this.isEdit.set(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  public onSave() {
    this.isEdit.set(false);
    this.action$$.next('');
  }

  public onCreate() {
    this.currentRoute.set(null);
    this.isEdit.set(true);
  }

  public onDelete(route: TrainRoute) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Delete ${route.id} route.`,
        size: 's',
        data: getDeletionConfirmationData('route'),
      })
      .pipe(
        filter((response) => response),
        switchMap(() => this.routeApiService.deleteRoute(route)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
        next: () => {
          this.action$$.next('');
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
