import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OrderRequest } from '@features/search/interfaces/order.request.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private readonly httpClient = inject(HttpClient);

  public createOrder(order: OrderRequest) {
    return this.httpClient.post<{ id: number }>('/api/order', order);
  }

  public deleteOrder(orderId: number) {
    return this.httpClient.delete(`/api/order/${orderId}`);
  }
}
