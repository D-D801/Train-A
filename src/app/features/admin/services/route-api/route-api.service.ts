import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';

@Injectable({
  providedIn: 'root',
})
export class RouteApiService {
  private readonly httpClient = inject(HttpClient);

  public getRoutes() {
    return this.httpClient.get<TrainRoute[]>('/api/route');
  }

  public getRoute(id: number) {
    return this.httpClient.get<TrainRoute>(`/api/route/${id}`);
  }

  public createRoute(route: Omit<TrainRoute, 'id'>) {
    return this.httpClient.post<{ id: number }>('/api/route', route);
  }

  public updateRoute(route: TrainRoute) {
    return this.httpClient.put<{ id: number }>(`/api/route/${route.id}`, route);
  }

  public deleteRoute(route: TrainRoute) {
    return this.httpClient.delete(`/api/route/${route.id}`);
  }
}
