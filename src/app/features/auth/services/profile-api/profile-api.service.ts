import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInfo } from '@features/auth/interfaces/user-info.interface';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public getUserInformation() {
    return this.httpClient.get<UserInfo>('/api/profile');
  }

  public updateUserInformation(body: Partial<UserRequest>) {
    return this.httpClient.put<UserInfo>('/api/profile', body);
  }

  public updatePassword(newPassword: string) {
    return this.httpClient.put('/api/profile/password', { password: newPassword });
  }
}
