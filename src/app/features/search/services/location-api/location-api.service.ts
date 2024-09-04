import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

const responseLimit = 5;

export interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = 'https://nominatim.openstreetmap.org/search';

  public getLocationCoordinates(city: string) {
    const url = `${this.apiUrl}?q=${city}&format=json&limit=${responseLimit}`;
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
}
