import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginRequest } from '@features/auth/interfaces/auth.interface';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthApiService } from './auth-api.service';

const KEY_USER_TOKEN = 'userToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router: Router = inject(Router);

  private readonly alerts = inject(TuiAlertService);

  private authApiService = inject(AuthApiService);

  private localStorage: LocalStorageService = inject(LocalStorageService);

  public isLoggedIn: WritableSignal<boolean>;

  public isAdminIn = signal(false);

  constructor() {
    this.isLoggedIn = signal(this.getAuthStatus());
  }

  public signin(body: LoginRequest) {
    this.authApiService.signin(body).subscribe({
      next: () => {
        this.isLoggedIn.set(true);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.alerts.open(err.error?.message || 'smt went wrong', { label: 'Error:', appearance: 'error' }).subscribe();
        return EMPTY;
      },
    });
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
