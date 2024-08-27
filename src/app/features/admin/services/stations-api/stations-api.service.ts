import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { StationListItem } from '@features/admin/interfaces/station-list-item.interface';

interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled';
  path: number[];
  carriages: string[];
  schedule: {
    segments: RoadSection[];
  };
}

interface RoadSection {
  time: string[];
  price: {
    [carriageType: string]: number;
  };
}

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

  public retrieveOrders() {
    return this.httpClient.get<Order[]>('/api/order');
  }
}
