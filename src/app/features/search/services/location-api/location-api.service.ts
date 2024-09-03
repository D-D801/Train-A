import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CityInfo } from '@features/search/interfaces/city-info.interface';
import { environment } from 'src/environments/environment';

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
