import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SearchRouteParams } from '../interfaces/search-route-params';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _cities = signal([{ name: 'Nuew-Yotk' }, { name: 'Taganrog' }]);

  public cities = this._cities.asReadonly();

  private httpClient = inject(HttpClient);

  search({ fromLatitude, fromLongitude, toLatitude, toLongitude, time }: SearchRouteParams) {
    const params = {
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
      time,
    };
    return this.httpClient.get('/api/search', { params });
  }

  getStations() {
    return this.httpClient.get('/api/station');
  }
}
