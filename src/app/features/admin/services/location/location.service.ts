import { Injectable, signal } from '@angular/core';
import { CityWithCoordinates } from '@features/admin/interfaces/city-with-coordinates.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly _city = signal<CityWithCoordinates | null>(null);

  public city = this._city.asReadonly();

  private readonly _connectedStationList = signal<string[]>([]);

  public connectedStationList = this._connectedStationList.asReadonly();

  public setCitySignal(city: CityWithCoordinates | null) {
    this._city.set(city);
  }

  public setConnectedStationList(cities: string[]) {
    this._connectedStationList.set(cities);
  }
}
