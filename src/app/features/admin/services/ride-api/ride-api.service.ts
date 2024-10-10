import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Segment } from '@shared/interfaces/segment.interface';

@Injectable({
  providedIn: 'root',
})
export class RideApiService {
  private readonly httpClient = inject(HttpClient);

  public createNewRide(routeId: number, body: { segments: Segment[] }) {
    return this.httpClient.post<{ id: number }>(`/api/route/${routeId}/ride`, body);
  }

  public updateRide(routeId: number, rideId: number, body: { segments: Partial<Segment>[] }) {
    return this.httpClient.put(`/api/route/${routeId}/ride/${rideId}`, body);
  }

  public deleteRide(routeId: number, rideId: number) {
    return this.httpClient.delete(`/api/route/${routeId}/ride/${rideId}`);
  }
}
