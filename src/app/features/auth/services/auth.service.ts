import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { UserRequest } from '@features/auth/interfaces/auth.interface';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router: Router = inject(Router);

  private readonly alerts = inject(AlertService);

  private authApiService = inject(AuthApiService);

  private localStorage: LocalStorageService = inject(LocalStorageService);

  public isLoggedIn: WritableSignal<boolean>;

  public isAdminIn = signal(false);

  constructor() {
    this.isLoggedIn = signal(this.getAuthStatus());
  }

  public signin(body: UserRequest) {
    return this.authApiService.signin(body).pipe(
      tap((response) => {
        this.isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
        this.router.navigate(['/home']);
      }),
      catchError(({ error: { message } }) => {
        this.alerts.open({ message: message || 'smt went wrong', label: 'Error:', appearance: 'error' });
        return EMPTY;
      })
    );
  }

  public signup(/* email: string = 'test', password: string= 'test' */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(LocalStorageKey.UserToken, 'mockToken');
  }

  public logout() {
    this.localStorage.removeItem(LocalStorageKey.UserToken);
    this.isLoggedIn.set(false);
    this.isAdminIn.set(false);
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }
}
