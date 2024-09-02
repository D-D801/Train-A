import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { switchMap, tap } from 'rxjs';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { ProfileApiService } from '@features/auth/services/profile-api/profile-api.service';
import { Role } from '@shared/enums/role.enum';
import { AuthApiService } from '../../../features/auth/services/auth-api/auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly profileApiService = inject(ProfileApiService);

  private readonly authApiService = inject(AuthApiService);

  private readonly localStorage = inject(LocalStorageService);

  private readonly _isLoggedIn = signal(this.getAuthStatus());

  public isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly _role = signal<keyof typeof Role | null>(null);

  public role = this._role.asReadonly();

  public signin(body: UserRequest) {
    return this.authApiService.signin(body).pipe(
      tap((response) => {
        this._isLoggedIn.set(true);
        this.localStorage.setItem(LocalStorageKey.UserToken, response.token);
      }),
      switchMap(() => this.profileApiService.getUserInformation()),
      tap((res) => this._role.set(res.role))
    );
  }

  public signup(body: UserRequest) {
    return this.authApiService.signup(body).pipe(switchMap(() => this.signin(body)));
  }

  public logout() {
    return this.authApiService.logout().pipe(
      tap(() => {
        this._isLoggedIn.set(false);
        this._role.set(null);
      })
    );
  }

  public setRole(role: keyof typeof Role) {
    this._role.set(role);
  }

  private getAuthStatus() {
    return !!this.localStorage.getItem(LocalStorageKey.UserToken);
  }
}
