import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
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
  private authService: AuthService = inject(AuthService);

  private router: Router = inject(Router);

  public isLoggedIn: WritableSignal<boolean> = this.authService.isLoggedIn;

  public isAdminIn: WritableSignal<boolean> = this.authService.isAdminIn;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
