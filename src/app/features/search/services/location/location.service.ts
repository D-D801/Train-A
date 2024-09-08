import { Injectable, signal } from '@angular/core';
import { CityWithCoordinates } from '@features/search/interfaces/city.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly _city = signal<CityWithCoordinates | null>(null);

  public city = this._city.asReadonly();

  public setCitySignal(city: CityWithCoordinates) {
    this._city.set(city);
  }
}
