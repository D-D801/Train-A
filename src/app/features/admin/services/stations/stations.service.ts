import { Injectable, signal } from '@angular/core';
import { StationListItem } from '@features/admin/interfaces/station-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private readonly _stations = signal<StationListItem[]>([]);

  public stations = this._stations.asReadonly();

  public setStations(receivedStations: StationListItem[]) {
    this._stations.set(receivedStations);
  }

  public deleteStationFromList(id: number) {
    this._stations.update((stations) => stations.filter((station) => station.id !== id));
  }

  public getStation(id: number) {
    return this.stations().find((station: StationListItem) => station.id === id);
  }
}
