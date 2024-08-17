import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _cities = signal([{ name: 'Nuew-Yotk' }, { name: 'Taganrog' }]);

  public cities = this._cities.asReadonly();
  private httpClient = inject(HttpClient);

  search() {
    const params = {
      fromLatitude: 48.8575,
      fromLongitude: 2.3514,
      toLatitude: 40.4167,
      toLongitude: 3.7033,
      time: 1723669200000
    }
    return this.httpClient.get('/api/search', { params }).pipe()
  }
}
