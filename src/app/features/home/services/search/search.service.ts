import { Injectable, signal } from '@angular/core';
import { CityInfo } from '@features/home/interfaces/city-info.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly _cities = signal<CityInfo[]>([]);

  public cities = this._cities.asReadonly();

  public setCities(receivedCities: CityInfo[]) {
    this._cities.set(receivedCities);
  }
}
