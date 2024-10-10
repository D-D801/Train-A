import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@features/orders/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly httpClient = inject(HttpClient);

  public getUsers() {
    return this.httpClient.get<User[]>('/api/users');
  }
}
