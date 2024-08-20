import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'dd-header-menu',
  standalone: true,
  imports: [TuiNavigation, TuiButton, RouterLink, NgIf],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMenuComponent {
  private readonly localStorage = inject(LocalStorageService);

  private readonly authService = inject(AuthService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly router = inject(Router);

  public isLoggedIn = this.authService.isLoggedIn;

  public isAdminIn = this.authService.isAdminIn;

  public logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.localStorage.removeItem(LocalStorageKey.UserToken);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }
}
