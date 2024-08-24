import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SearchRouteParams } from '@features/search/interfaces/search-route-params.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  private readonly httpClient = inject(HttpClient);

  public search(params: SearchRouteParams) {
    return this.httpClient.get('/api/search', {
      params: { ...params },
    });
  }
}
