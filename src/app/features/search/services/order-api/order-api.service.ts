import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OrderRequest } from '@features/search/interfaces/order.request.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  private readonly httpClient = inject(HttpClient);

  public createOrder(order: OrderRequest) {
    return this.httpClient.post('/api/order', order);
  }
}
