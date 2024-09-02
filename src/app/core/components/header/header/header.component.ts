import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiChevron, TuiTabs, TuiTabsWithMore } from '@taiga-ui/kit';
import { TitleCasePipe } from '@angular/common';
import { TuiDropdown, TuiDataList, TuiIcon, TuiButton } from '@taiga-ui/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth/auth.service';
import { AlertService } from '@core/services/alert/alert.service';
import { tuiIsString } from '@taiga-ui/cdk';
import { Role } from '@shared/enums/role.enum';
import { LogoComponent } from '../logo/logo.component';

function isString(tab: unknown): tab is string {
  return tuiIsString(tab);
}

@Component({
  selector: 'dd-header',
  standalone: true,
  imports: [
    LogoComponent,
    TuiHeader,
    TuiTabsWithMore,
    TuiTabs,
    TuiChevron,
    TuiDropdown,
    TuiDataList,
    TuiIcon,
    RouterLink,
    TuiButton,
    TitleCasePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);

  private readonly destroy = inject(DestroyRef);

  private readonly alert = inject(AlertService);

  private readonly router = inject(Router);

  protected readonly isLoggedIn = this.authService.isLoggedIn;

  private readonly role = this.authService.role;

  protected readonly headerPages = computed(() => {
    if (!this.isLoggedIn()) {
      return ['home', 'sign in'];
    }

    if (this.role() === Role.manager) {
      return ['home', 'profile', 'my orders', this.adminPages];
    }

    return ['home', 'profile', 'my orders'];
  });

  protected activeElement = signal('home');

  protected readonly adminPages = ['stations', 'carriages', 'routes'];

  protected isString = isString;

  protected open = false;

  public ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.url),
        tap((url) => this.updateActiveElement(url)),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe();
  }

  protected updateActiveElement(currentUrl: string) {
    const formattedUrl = currentUrl
      .replace('/', '')
      .replace('login', 'sign in')
      .replace('orders', 'my orders')
      .split('/');

    if (this.headerPages().includes(formattedUrl[0])) {
      this.activeElement.set(formattedUrl[0]);
      return;
    }
    if (this.adminPages.includes(formattedUrl[1])) {
      this.activeElement.set(formattedUrl[1]);
      return;
    }
    this.activeElement.set('home');
  }

  protected onClick(activeElement: string) {
    this.activeElement.set(activeElement);

    const route = activeElement.replace('sign in', 'login').replace('my orders', 'orders');

    if (this.adminPages.includes(activeElement)) {
      this.router.navigate([`/admin/${route}`]);
      return;
    }

    if (this.headerPages().includes(activeElement)) {
      this.router.navigate([`/${route}`]);
      return;
    }

    this.router.navigate([`/home`]);
  }

  public logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      });
  }

  protected get activeItemIndex() {
    return this.headerPages().indexOf(
      this.adminPages.includes(this.activeElement()) ? this.adminPages : this.activeElement()
    );
  }
}
