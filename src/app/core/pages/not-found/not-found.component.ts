import { NgIf, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBreakpointService, TuiButton, TuiSizeL } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'dd-not-found',
  standalone: true,
  imports: [NgIf, AsyncPipe, TuiBlockStatus, TuiButton, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly breakpointService = inject(TuiBreakpointService);

  protected size$: Observable<TuiSizeL> = this.breakpointService.pipe(map((key) => (key === 'mobile' ? 'm' : 'l')));
}
