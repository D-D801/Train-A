import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteTabComponent } from '@features/admin/pages/tabs/route-tab/route-tab.component';

@Component({
  selector: 'dd-admin-page',
  standalone: true,
  imports: [RouteTabComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {}
