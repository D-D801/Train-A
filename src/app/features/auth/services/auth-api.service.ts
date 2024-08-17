import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponse, UserRequest } from '@features/auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public signin(body: UserRequest) {
    return this.httpClient.post<UserResponse>('/api/signin', body);
  }
}
