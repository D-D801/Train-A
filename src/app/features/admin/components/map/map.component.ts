import { ChangeDetectionStrategy, Component, OnDestroy, inject, effect } from '@angular/core';
import { StationsService } from '@core/services/stations/stations.service';
import { Station } from '@features/admin/interfaces/station.interface';
import { CityWithCoordinates } from '@features/search/interfaces/city.interface';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { LocationService } from '@features/search/services/location/location.service';
import * as L from 'leaflet';

@Component({
  selector: 'dd-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy {
  protected readonly stationsService = inject(StationsService);

  private readonly locationApiService = inject(LocationApiService);

  private readonly locationService = inject(LocationService);

  protected readonly stations = this.stationsService.stations;

  private map!: L.Map;

  public constructor() {
    effect(() => {
      if (this.stations()) {
        this.updateMap(this.stations());
      }
    });
  }

  public ngOnDestroy(): void {
    this.cleanUpMap();
  }

  private initMap(stations: Station[]) {
    this.map = L.map('map').setView([53.505, 27.09], 3);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.addMarkers(stations);
    this.map.on('click', this.handleMapClick.bind(this));
  }

  private updateMap(stations: Station[]): void {
    if (this.map) {
      this.cleanUpMap();
    }
    setTimeout(() => {
      this.initMap(stations);
    }, 0);
  }

  private addMarkers(stations: Station[]): void {
    const markers = stations.map((station) => {
      return L.marker([station.latitude, station.longitude]).bindPopup(station.city);
    });

    const cities = L.layerGroup(markers);
    cities.addTo(this.map);
  }

  private cleanUpMap(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  private handleMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    this.locationApiService.getCityName(lat, lng).subscribe((city) => {
      const cityWithCoordinates: CityWithCoordinates = {
        title: city ?? '',
        coordinates: {
          lat,
          lng,
        },
      };
      this.locationService.setCitySignal(cityWithCoordinates);
    });
  }
}
