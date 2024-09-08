import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

const responseLimit = 5;

export interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
}

interface NominatimResponseCity {
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

  private readonly apiUrl = 'https://nominatim.openstreetmap.org';

  public getLocationCoordinates(city: string) {
    const url = `${this.apiUrl}/search?q=${city}&format=json&limit=${responseLimit}`;
    return this.httpClient.get<NominatimResponse[]>(url).pipe(
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
      .get<NominatimResponseCity>(url)
      .pipe(map((response) => response.address?.city || response.address?.town || 'City not found'));
  }
}
