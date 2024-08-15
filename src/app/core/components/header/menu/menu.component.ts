import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'dd-menu',
  standalone: true,
  imports: [TuiNavigation, TuiButton, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {}
