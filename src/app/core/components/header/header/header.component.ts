import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiChevron, TuiTabs, TuiTabsWithMore } from '@taiga-ui/kit';
import { TitleCasePipe } from '@angular/common';
import { tuiIsString } from '@taiga-ui/cdk';
import { TuiDropdown, TuiDataList, TuiIcon, TuiButton } from '@taiga-ui/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LogoComponent } from '../logo/logo.component';

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
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly destroy = inject(DestroyRef);

  protected readonly adminPages = ['stations', 'carriages', 'routes'];

  protected readonly tabs = ['home', 'profile', 'orders', this.adminPages];

  protected activeElement = signal('home');

  protected open = false;

  public ngOnInit(): void {
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
    const formattedUrl = currentUrl.replace('/', '').split('/');

    if (this.tabs.includes(formattedUrl[0])) {
      this.activeElement.set(formattedUrl[0]);
    } else if (this.adminPages.includes(formattedUrl[1])) {
      this.activeElement.set(formattedUrl[1]);
    } else {
      this.activeElement.set('home');
    }
  }

  protected onClick(activeElement: string) {
    this.activeElement.set(activeElement);

    if (this.adminPages.includes(activeElement)) {
      this.router.navigate([`/admin/${activeElement}`]);
    } else {
      this.router.navigate([`/${activeElement.toLowerCase().replace(' ', '-')}`]);
    }
  }

  protected get activeItemIndex(): number {
    if (this.adminPages.includes(this.activeElement())) {
      return this.tabs.indexOf(this.adminPages);
    }

    return this.tabs.indexOf(this.activeElement());
  }

  // eslint-disable-next-line class-methods-use-this
  protected isString(tab: unknown): tab is string {
    return tuiIsString(tab);
  }
}
