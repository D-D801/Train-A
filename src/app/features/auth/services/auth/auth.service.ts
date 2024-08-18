import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { catchError, EMPTY } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
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
  private readonly authApiService = inject(AuthApiService);

  private readonly alert = inject(AlertService);

  private readonly localStorage = inject(LocalStorageService);

  private router = inject(Router);

  private readonly alerts = inject(TuiAlertService);

  public isLoggedIn = signal(this.getAuthStatus());

  public isAdminIn = signal(false);

  public signin(/* email: string = 'test', password: string= 'test' */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(LocalStorageKey.UserToken, 'mockToken');
  }

  public signup(body: UserRequest) {
    this.authApiService
      .signup(body)
      .pipe(
        catchError(({ error: { message } }: HttpErrorResponse) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
          return EMPTY;
        })
      )
      .subscribe((response: UserResponse) => {
        this.isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
        this.router.navigate(['/home']);
      });
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
