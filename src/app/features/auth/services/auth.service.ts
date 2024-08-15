import { Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';
import { AuthApiService } from './auth-api.service';

const KEY_USER_TOKEN = 'userToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn: WritableSignal<boolean>;

  public isAdminIn = signal(false);

  constructor(
    private authApiService: AuthApiService,
    private localStorage: LocalStorageService
  ) {
    this.isLoggedIn = signal(this.getAuthStatus());
  }

  public signin(/* email: string = 'test', password: string= 'test' */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(KEY_USER_TOKEN, 'mockToken');
  }

  public signup(/* email: string = 'test', password: string= 'test' */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(KEY_USER_TOKEN, 'mockToken');
  }

  public logout() {
    this.localStorage.removeItem(KEY_USER_TOKEN);
    this.isLoggedIn.set(false);
    this.isAdminIn.set(false);
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(KEY_USER_TOKEN);
  }
}
