import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { switchMap, tap } from 'rxjs';
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

  private readonly authApiService = inject(AuthApiService);

  private readonly localStorage = inject(LocalStorageService);

  private readonly _isLoggedIn = signal(this.getAuthStatus());

  public isLoggedIn = this._isLoggedIn.asReadonly();

  // TODO: change role
  private readonly _isAdminIn = signal(true);

  public isAdminIn = this._isAdminIn.asReadonly();

  public signin(body: UserRequest) {
    return this.authApiService.signin(body).pipe(
      tap((response) => {
        this._isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
      })
    );
  }

  public signup(body: UserRequest) {
    return this.authApiService.signup(body).pipe(switchMap(() => this.signin(body)));
  }

  public logout() {
    return this.authApiService.logout().pipe(
      tap(() => {
        this._isLoggedIn.set(false);
        this._isAdminIn.set(false);
      })
    );
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }
}
