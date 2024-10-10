import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiTab, TuiTabs } from '@taiga-ui/kit';
import { TuiScrollbar } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CarriagesPageComponent } from '../carriages-page/carriages-page.component';

@Component({
  selector: 'dd-admin-page',
  standalone: true,
  imports: [TuiTabs, TuiTab, CarriagesPageComponent, TuiScrollbar, NgClass, RouterOutlet, RouterLink],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  protected activeItemIndex = 0;
}
