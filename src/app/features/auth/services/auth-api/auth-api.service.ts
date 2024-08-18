import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { UserResponse } from '@features/auth/interfaces/user-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);

  public signup(body: UserRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>('/api/signup', body);
  }

  public signin(body: UserRequest) {
    return this.httpClient.post<UserResponse>('/api/signin', body);
  }
}