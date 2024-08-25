import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { StationListItem } from '@features/admin/interfaces/station-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class StationsApiService {
  private readonly httpClient = inject(HttpClient);

  public retrieveStationList() {
    return this.httpClient.get<StationListItem[]>('/api/station');
  }

  public createNewStation(body: NewStation) {
    return this.httpClient.post('/api/station', body);
  }

  public deleteStation(id: number) {
    this.httpClient.delete(`/api/station/${id}`);
  }
}
