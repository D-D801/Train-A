import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { Order } from '@features/orders/interfaces/order.interface';
import { OrderRequest } from '@features/orders/interfaces/order.request.interface';
import { Role } from '@shared/enums/role.enum';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly authService = inject(AuthService);

  private readonly role = this.authService.role;

  public getOrders() {
    let params = new HttpParams();
    if (this.role() === Role.manager) {
      params = params.set('all', 'true');
    }
    return this.httpClient.get<Order[]>('/api/order', { params });
  }

  public createOrder(order: OrderRequest) {
    return this.httpClient.post<{ id: number }>('/api/order', order);
  }

  public deleteOrder(orderId: number) {
    return this.httpClient.delete(`/api/order/${orderId}`);
  }

  public retrieveOrders() {
    return this.httpClient.get<Order[]>('/api/order');
  }
}
