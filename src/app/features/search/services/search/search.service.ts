import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CityInfo } from '@features/search/interfaces/city-info';
import { SearchRouteParams } from '../../interfaces/search-route-params';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _cities = signal<CityInfo[]>([]);

  public cities = this._cities.asReadonly();

  private readonly httpClient = inject(HttpClient);

  public search({ fromLatitude, fromLongitude, toLatitude, toLongitude, time }: SearchRouteParams) {
    return this.httpClient
      .get('/api/search', {
        params: {
          fromLatitude,
          fromLongitude,
          toLatitude,
          toLongitude,
          time,
        },
      })
      .pipe();
  }

  public setCities(receivedCities: CityInfo[]) {
    this._cities.set(receivedCities);
  }
}
