import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'dd-menu',
  standalone: true,
  imports: [TuiNavigation, TuiButton, RouterLink, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  public isLoggedIn: WritableSignal<boolean>;

  public isAdminIn: WritableSignal<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.isAdminIn = this.authService.isAdminIn;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
