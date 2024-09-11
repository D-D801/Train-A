import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { Station } from '@features/admin/interfaces/station-list-item.interface';

@Injectable({
  providedIn: 'root',
})
export class StationsApiService {
  private readonly httpClient = inject(HttpClient);

  public getStations() {
    return this.httpClient.get<Station[]>('/api/station');
  }

  public createNewStation(body: NewStation) {
    return this.httpClient.post<{ id: number }>('/api/station', body);
  }

  public deleteStation(id: number) {
    return this.httpClient.delete(`/api/station/${id}`);
  }
}
