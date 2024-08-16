import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { UserResponse } from '@features/auth/interfaces/user-response.interface';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  signup(body: UserRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>('/api/signup', body).pipe(switchMap(() => this.signin(body)));
  }

  signin(body: UserRequest) {
    return this.httpClient.post<UserResponse>('/api/signin', body);
  }
}
