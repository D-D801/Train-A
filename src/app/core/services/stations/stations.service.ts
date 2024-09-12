import { inject, Injectable, signal } from '@angular/core';
import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { Station } from '@features/admin/interfaces/station-list-item.interface';
import { tap } from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private readonly stationsApiService = inject(StationsApiService);

  private readonly alert = inject(AlertService);

  private readonly _stations = signal<Station[]>([]);

  public stations = this._stations.asReadonly();

  public addStations() {
    return this.stationsApiService.getStations().pipe(
      tap({
        next: (stations) => {
          this._stations.set(stations);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      })
    );
  }

  public deleteStationFromList(id: number) {
    this._stations.update((stations) => stations.filter((station) => station.id !== id));
  }

  public addStationInList(stations: Station[]) {
    this._stations.set(stations);
  }

  public getStations(connectedStationsIds: number[]) {
    const stations = this.stations();
    return stations ? stations.filter((station: Station) => connectedStationsIds.includes(station.id)) : [];
  }

  public getStationNamesByIds(ids: number[]) {
    return ids.map((id) => this.getStationNameById(id));
  }

  public getStationNameById(id: number) {
    return this.stations().find((carriage) => carriage.id === id)?.city ?? '';
  }

  public getStationIdByName(name: string) {
    return this.stations().find((carriage) => carriage.city === name)?.id ?? null;
  }
}
