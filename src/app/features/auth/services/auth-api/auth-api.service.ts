import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { UserResponse } from '@features/auth/interfaces/user-response.interface';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly localStorage = inject(LocalStorageService);

  public signup(body: UserRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>('/api/signup', body);
  }

  public signin(body: UserRequest) {
    return this.httpClient.post<UserResponse>('/api/signin', body);
  }

  public logout() {
    const token = this.localStorage.getItem(LocalStorageKey.UserToken);
    return this.httpClient.delete('/api/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
