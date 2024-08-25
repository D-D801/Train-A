import { Injectable, signal } from '@angular/core';
import { StationListItem } from '@features/admin/interfaces/station-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private readonly _cities = signal<StationListItem[]>([]);

  public cities = this._cities.asReadonly();

  private readonly _existingStations = signal<StationListItem[]>([]);

  public existingStations = this._cities.asReadonly();

  public setCities(receivedCities: StationListItem[]) {
    this._cities.set(receivedCities);
  }

  public setExistingStations(receivedCities: StationListItem[]) {
    this._cities.set(receivedCities);
  }
}
