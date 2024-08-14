import { TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dd-root',
  standalone: true,
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'train-a';
}
