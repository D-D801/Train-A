import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-stations-page',
  standalone: true,
  imports: [],
  templateUrl: './stations-page.component.html',
  styleUrl: './stations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationsPageComponent {

}
