import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CityInfo } from '../../interfaces/city-info.interface';

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

  public getLocation(lat: number, lon: number) {
    return this.httpClient.get(
      `${environment.baseLocationApiUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${environment.locationApiKey}`
    );
  }
}
