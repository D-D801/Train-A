import { TuiRoot } from '@taiga-ui/core';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header/header.component';
import { CarriagesService } from '@core/services/carriages/carriages.service';
import { take } from 'rxjs';
import { StationsService } from '@core/services/stations/stations.service';

@Component({
  selector: 'dd-root',
  standalone: true,
  imports: [RouterOutlet, TuiRoot, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly carriagesService = inject(CarriagesService);

  private readonly stationsService = inject(StationsService);

  public constructor() {
    this.carriagesService.addCarriages().pipe(take(1)).subscribe();
    this.stationsService.addStations().pipe(take(1)).subscribe();
  }
}
