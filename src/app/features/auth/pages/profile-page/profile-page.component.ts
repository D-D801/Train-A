import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {}
