import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { LogoComponent } from '../logo/logo.component';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';

@Component({
  selector: 'dd-header',
  standalone: true,
  imports: [LogoComponent, HeaderMenuComponent, TuiHeader],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
