import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { UserResponse } from '@features/auth/interfaces/user-response.interface';
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
    this.authApiService
      .signup(body)
      .pipe(
        catchError(({ error: { message } }: HttpErrorResponse) => {
          this.alerts.open({ message, label: 'Error', appearance: 'error' });
          return EMPTY;
        })
      )
      .subscribe((response: UserResponse) => {
        this._isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
        this.router.navigate(['/home']);
      });
  }

  public logout() {
    this.localStorage.removeItem(LocalStorageKey.UserToken);
    this._isLoggedIn.set(false);
    this._isAdminIn.set(false);
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }
}
