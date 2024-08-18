import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  private authService: AuthService = inject(AuthService);

  private router: Router = inject(Router);

  public isLoggedIn = this.authService.isLoggedIn;

  public isAdminIn = this.authService.isAdminIn;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
