import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInformation } from '@features/auth/interfaces/user-information.interface';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public getUserInformation() {
    return this.httpClient.get<UserInformation>('/api/profile');
  }

  public updateUserInformation(body: Partial<UserRequest>) {
    return this.httpClient.put<UserInformation>('/api/profile', body);
  }

  public updatePassword(body: { password: string }) {
    return this.httpClient.put('/api/profile/password', body);
  }
}
