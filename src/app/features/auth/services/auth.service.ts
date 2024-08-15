import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';

const KEY_USER_TOKEN = 'fakeUserToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // public isLoggedIn = signal(this.getAuthStatus());

  public isLoggedIn = signal(false);

  public isAdminIn = signal(true);

  public isLoginned(): boolean {
    return this.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.isAdminIn();
  }

  constructor(private localStorage: LocalStorageService) {}

  private getAuthStatus() {
    return !!this.localStorage.getItem(KEY_USER_TOKEN);
  }
}
