import { ChangeDetectionStrategy, Component, OnDestroy, inject, effect } from '@angular/core';
import { StationsService } from '@core/services/stations/stations.service';
import { LocationApiService } from '@features/admin/services/location-api/location-api.service';
import { LocationService } from '@features/admin/services/location/location.service';
import * as L from 'leaflet';
import { Station } from '@shared/interfaces/station.interface';
import { CityWithCoordinates } from '@features/admin/interfaces/city-with-coordinates.interface';

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

  private polylines: L.Polyline[] = [];

  private newStationMarker: L.Marker | null = null;

  private readonly myIcon = L.icon({
    iconUrl: 'marker-icon.png',
    iconAnchor: [12, 40],
    popupAnchor: [1, -33],
    shadowUrl: 'marker-shadow.png',
    shadowAnchor: [12, 40],
  });

  public constructor() {
    effect(() => {
      if (this.stations().length) {
        this.updateMap(this.stations());
      }
    });
    effect(() => {
      if (this.stations()) {
        this.locationService.connectedStationList();
        this.drawLinesBetweenSelectedPointAndConnectedList();
      }
    });
    effect(() => {
      const city = this.locationService.city();
      if (city) this.drawNewStationMarkerOnMap(city.coordinates.lat, city.coordinates.lng, city.title);
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
    this.initMap(stations);
  }

  private addMarkers(stations: Station[]): void {
    const selectedMarkers: L.Marker[] = [];
    const markers = stations.map((station) => {
      const marker = L.marker([station.latitude, station.longitude], { icon: this.myIcon }).bindPopup(station.city);

      this.addMarkerClickHandler(marker, station, stations);

      selectedMarkers.push(marker);
      return marker;
    });

    const cities = L.layerGroup(markers);
    cities.addTo(this.map);
  }

  private addMarkerClickHandler(marker: L.Marker, station: Station, stations: Station[]) {
    marker.on('click', () => {
      this.clearPolylines();

      station.connectedTo.forEach((connect) => {
        const connectStation = stations.find((station1) => station1.id === connect.id);
        if (connectStation) {
          const marker2 = L.marker([connectStation.latitude, connectStation.longitude], { icon: this.myIcon });
          this.drawLineBetweenMarkers([marker, marker2]);
        }
      });
    });
  }

  private drawLineBetweenMarkers(markers: [L.Marker, L.Marker]) {
    const latlngs = markers.map((marker) => marker.getLatLng());

    const polyline = L.polyline(latlngs, { color: 'var(--tui-info)' }).addTo(this.map);

    this.polylines.push(polyline);
  }

  private clearPolylines() {
    this.polylines.forEach((polyline) => {
      this.map.removeLayer(polyline);
    });
    this.polylines = [];
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

      this.drawNewStationMarkerOnMap(lat, lng, cityWithCoordinates.title);
    });
  }

  private drawNewStationMarkerOnMap(lat: number, lng: number, title: string) {
    if (this.newStationMarker) {
      this.map.removeLayer(this.newStationMarker);
    }

    this.clearPolylines();
    this.newStationMarker = L.marker([lat, lng], { icon: this.myIcon }).bindPopup(title);
    this.newStationMarker.addTo(this.map);
    this.newStationMarker.openPopup();

    this.drawLinesBetweenSelectedPointAndConnectedList();
    this.newStationMarker.on('click', () => {
      this.drawLinesBetweenSelectedPointAndConnectedList();
    });
  }

  private drawLinesBetweenSelectedPointAndConnectedList() {
    if (this.stations()) {
      this.clearPolylines();

      this.locationService.connectedStationList().forEach((cityName) => {
        const connectedStation = this.stations().find((station) => station.city === cityName);
        if (connectedStation && this.newStationMarker) {
          const newMarker = L.marker([connectedStation.latitude, connectedStation.longitude], { icon: this.myIcon });

          this.drawLineBetweenMarkers([this.newStationMarker, newMarker]);
        }
      });
    }
  }
}
