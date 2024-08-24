import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainRoute } from '@features/admin/interfaces/train-route.interface';

@Injectable({
  providedIn: 'root',
})
export class RouteApiService {
  private readonly http = inject(HttpClient);

  public getRoute() {
    return this.http.get<TrainRoute[]>('/api/route');
  }

  public createRoute(route: TrainRoute) {
    return this.http.post<TrainRoute>('/api/route', route);
  }

  public updateRoute(route: TrainRoute) {
    return this.http.put<TrainRoute>(`/api/route/${route.id}`, route);
  }

  public deleteRoute(route: TrainRoute) {
    return this.http.delete<TrainRoute>(`/api/route/${route.id}`);
  }
}
