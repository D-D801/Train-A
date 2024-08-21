import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Carriage } from '@features/admin/interfaces/carriage.interface';

@Injectable({
  providedIn: 'root',
})
export class CarriageApiService {
  private readonly http = inject(HttpClient);

  public getCarriages() {
    return this.http.get<Carriage[]>('/api/carriage');
  }

  public createCarriage(carriage: Carriage) {
    return this.http.post<Carriage>('/api/carriage', carriage);
  }

  public updateCarriage(carriage: Carriage) {
    return this.http.put<Carriage>(`/api/carriage/${carriage.code}`, carriage);
  }
}
