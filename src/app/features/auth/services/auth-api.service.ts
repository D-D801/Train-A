import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '@features/auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public signin(body: LoginRequest) {
    return this.httpClient.post<LoginRequest>('/api/signin', body);
  }
}
