import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { switchMap, tap } from 'rxjs';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { ProfileApiService } from '@features/auth/services/profile-api/profile-api.service';
import { AuthApiService } from '@features/auth/services/auth-api/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly profileApiService = inject(ProfileApiService);

  private readonly authApiService = inject(AuthApiService);

  private readonly localStorage = inject(LocalStorageService);

  private readonly _isLoggedIn = signal(this.getAuthStatus());

  public isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly _role = signal(this.getAuthRole());

  public role = this._role.asReadonly();

  public signin(body: UserRequest) {
    return this.authApiService.signin(body).pipe(
      tap((response) => {
        this._isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
      }),
      switchMap(() => this.profileApiService.getUserInformation()),
      tap(({ role }) => {
        this.localStorage.setItem(LocalStorageKey.UserRole, role);
        this._role.set(role);
      })
    );
  }

  public signup(body: UserRequest) {
    return this.authApiService.signup(body);
  }

  public logout() {
    return this.authApiService.logout().pipe(
      tap(() => {
        this._isLoggedIn.set(false);
        this._role.set(null);
        this.localStorage.removeItem(LocalStorageKey.UserToken);
        this.localStorage.removeItem(LocalStorageKey.UserRole);
      })
    );
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }

  private getAuthRole() {
    return this.localStorage.getItem(LocalStorageKey.UserRole);
  }
}
