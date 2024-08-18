import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CityInfo } from '../interfaces/city-info';

const BASE_URL = 'http://api.openweathermap.org/geo/1.0';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private httpClient = inject(HttpClient);

  apiLocationKey = import.meta.env.NG_APP_API_LOCATION_KEY;

  getLocationCoordinates(city: string) {
    return this.httpClient.get<CityInfo[]>(`${BASE_URL}/direct?q=${city}&limit=1&appid=${this.apiLocationKey}`);
  }
}
