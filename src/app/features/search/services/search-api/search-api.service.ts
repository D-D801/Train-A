import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SearchRouteParams } from '@features/search/interfaces/search-route-params.interface';
import { SearchRouteResponse, Trip } from '@features/search/interfaces/search-route-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  private readonly httpClient = inject(HttpClient);

  public search(params: SearchRouteParams) {
    return this.httpClient.get<SearchRouteResponse>('/api/search', {
      params: { ...params },
    });
  }

  public searchId(rideId: number) {
    return this.httpClient.get<Trip>(`/api/search/${rideId}`);
  }
}
