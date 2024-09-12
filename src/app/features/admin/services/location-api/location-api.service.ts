import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

const responseLimit = 5;

interface NominatimApiResponse {
  display_name: string;
  lat: string;
  lon: string;
}

interface NominatimApiCityResponse {
  address: {
    city?: string;
    town?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = environment.baseLocationApiUrl;

  public getLocationCoordinates(city: string) {
    const url = `${this.apiUrl}/search?q=${city}&format=json&limit=${responseLimit}`;
    return this.httpClient.get<NominatimApiResponse[]>(url).pipe(
      map((response) =>
        response.map((cit) => ({
          name: cit.display_name.split(',')[0],
          lat: parseFloat(cit.lat),
          lon: parseFloat(cit.lon),
        }))
      )
    );
  }

  public getCityName(lat: number, lng: number) {
    const url = `${this.apiUrl}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`;
    return this.httpClient
      .get<NominatimApiCityResponse>(url)
      .pipe(map((response) => response.address?.city || response.address?.town || 'City not found'));
  }
}
