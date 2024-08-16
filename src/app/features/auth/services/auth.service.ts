import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert/alert.service';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { ErrorResponse, UserRequest, UserResponse } from '../interfaces/auth.interface';

const KEY_USER_TOKEN = 'userToken';

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
          this.showNotification(message);
          return throwError(() => new Error(message));
        }),
        takeUntil(inject(Router).events)
      )
      .subscribe((response: UserResponse) => {
        this.isLoggedIn.set(true);
        this.localStorage.setItem(KEY_USER_TOKEN, response.token);
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

  protected showNotification(message: string): void {
    this.alerts
      .open('', {
        label: `Error: ${message}`,
        appearance: 'error',
      })
      .subscribe();
  }
}
