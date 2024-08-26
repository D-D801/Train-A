import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiTab, TuiTabs } from '@taiga-ui/kit';
import { TuiScrollbar } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { CarriagePageComponent } from '../carriage-page/carriage-page.component';

@Component({
  selector: 'dd-admin-page',
  standalone: true,
  imports: [TuiTabs, TuiTab, CarriagePageComponent, TuiScrollbar, NgClass],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  protected activeItemIndex = 0;
}
