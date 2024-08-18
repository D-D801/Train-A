import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { AuthApiService } from '../auth-api/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);

  private readonly alerts = inject(AlertService);

  private authApiService = inject(AuthApiService);

  private localStorage = inject(LocalStorageService);

  private _isLoggedIn = signal(this.getAuthStatus());

  public isLoggedIn = this._isLoggedIn.asReadonly();

  private _isAdminIn = signal(false);

  public isAdminIn = this._isAdminIn.asReadonly();

  public signin(body: UserRequest) {
    return this.authApiService.signin(body).pipe(
      tap((response) => {
        this._isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
        this.router.navigate(['/home']);
      }),
      catchError(({ error: { message } }) => {
        this.alerts.open({ message: message || 'smt went wrong', label: 'Error:', appearance: 'error' });
        return EMPTY;
      })
    );
  }

  public signup(body: UserRequest) {
    return this.authApiService.signup(body).pipe(switchMap(() => this.signin(body)));
  }

  public logout() {
    return this.authApiService.logout().pipe(
      catchError(({ error: { message } }) => {
        this.alerts.open({ message, label: 'Error', appearance: 'error' });
        return EMPTY;
      }),
      tap(() => {
        this.localStorage.removeItem(LocalStorageKey.UserToken);
        this._isLoggedIn.set(false);
        this._isAdminIn.set(false);
        this.router.navigate(['/home']);
      })
    );
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }
}
