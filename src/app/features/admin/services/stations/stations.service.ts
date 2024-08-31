import { Injectable, signal } from '@angular/core';
import { Station } from '@features/admin/interfaces/station-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private readonly _stations = signal<Station[] | null>(null);

  public stations = this._stations.asReadonly();

  public setStations(receivedStations: Station[]) {
    this._stations.set(receivedStations);
  }

  public addStationInList(station: Station) {
    this._stations.update((stations) => (stations ? [...stations, station] : [station]));
  }

  public deleteStationFromList(id: number) {
    this._stations.update((stations) => (stations ? stations.filter((station) => station.id !== id) : null));
  }

  public getStations(connectedStationsIds: number[]) {
    const stations = this.stations();
    return stations ? stations.filter((station: Station) => connectedStationsIds.includes(station.id)) : [];
  }
}
