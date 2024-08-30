import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewStation } from '@features/admin/interfaces/new-station.interface';
import { Station } from '@features/admin/interfaces/station-list-item.interface';

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
    return this.httpClient.get<Station[]>('/api/station');
  }

  public createNewStation(body: NewStation) {
    return this.httpClient.post<{ id: number }>('/api/station', body);
  }

  public deleteStation(id: number) {
    return this.httpClient.delete(`/api/station/${id}`);
  }

  // TODO: move retrieveOrders to the order service when it's created
  public retrieveOrders() {
    return this.httpClient.get<Order[]>('/api/order');
  }
}
