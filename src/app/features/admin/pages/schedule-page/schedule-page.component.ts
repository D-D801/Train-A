import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-schedule-page',
  standalone: true,
  imports: [],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent {}
