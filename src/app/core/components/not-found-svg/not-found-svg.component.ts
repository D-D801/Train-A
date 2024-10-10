import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-not-found-svg',
  standalone: true,
  imports: [],
  templateUrl: './not-found-svg.component.html',
  styleUrl: './not-found-svg.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundSvgComponent {}
