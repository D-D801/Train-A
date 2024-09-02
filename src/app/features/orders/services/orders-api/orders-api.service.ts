import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from '@features/orders/interfaces/order.interface';
import { OrderRequest } from '@features/orders/interfaces/order.request.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private readonly httpClient = inject(HttpClient);

  public getOrders() {
    return this.httpClient.get<Order[]>('/api/order');
  }

  public createOrder(order: OrderRequest) {
    return this.httpClient.post<{ id: number }>('/api/order', order);
  }

  public deleteOrder(orderId: number) {
    return this.httpClient.delete(`/api/order/${orderId}`);
  }
}
