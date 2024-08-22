import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environment';
import { CityInfo } from '../../interfaces/city-info';

const responseLimit = 5;

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private readonly httpClient = inject(HttpClient);

  public getLocationCoordinates(city: string) {
    return this.httpClient.get<CityInfo[]>(
      `${environment.baseLocationApiUrl}/direct?q=${city}&limit=${responseLimit}&appid=${environment.locationApiKey}`
    );
  }
}
