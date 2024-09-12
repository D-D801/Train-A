import { NgIf, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { NotFoundSvgComponent } from '../../components/not-found-svg/not-found-svg.component';

@Component({
  selector: 'dd-not-found',
  standalone: true,
  imports: [NgIf, AsyncPipe, TuiBlockStatus, TuiButton, RouterLink, NotFoundSvgComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
