import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-admin-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {}
