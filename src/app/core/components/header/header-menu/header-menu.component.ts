import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth/auth.service';
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
  private authService = inject(AuthService);

  private destroy = inject(DestroyRef);

  public isLoggedIn = this.authService.isLoggedIn;

  public isAdminIn = this.authService.isAdminIn;

  public logout() {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }
}
