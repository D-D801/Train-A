import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-existing-stations-list',
  standalone: true,
  imports: [],
  templateUrl: './existing-stations-list.component.html',
  styleUrl: './existing-stations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExistingStationsListComponent {}
