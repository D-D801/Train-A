import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-registration-page',
  standalone: true,
  imports: [],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {}
