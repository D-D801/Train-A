import { Injectable, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';
import { AuthApiService } from './auth-api.service';

const KEY_USER_TOKEN = 'userToken';

// interface ErrorResponse {
//   status: number;
//   reason: string;
// }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn: WritableSignal<boolean>;

  public isAdminIn = signal(false);

  // public isLoginned(): boolean {
  //   return this.isLoggedIn();
  // }

  // public isAdmin(): boolean {
  //   return this.isAdminIn();
  // }

  constructor(
    private authApiService: AuthApiService,
    private localStorage: LocalStorageService
  ) {
    this.isLoggedIn = signal(this.getAuthStatus());
  }

  public signin(/* email: string, password: string */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(KEY_USER_TOKEN, 'mockToken');
    // this.authApiService
    //   .signin({ email, password })
    //   .pipe(
    //     catchError((error: ErrorResponse) => {
    //       console.warn('Login error:', error);
    //       return throwError(() => new Error(error.reason));
    //     })
    //   )
    //   .subscribe((response: any) => {
    //     this.isLoggedIn.set(true);
    //     this.localStorage.setItem(KEY_USER_TOKEN, response.token);
    //   });
  }

  public signup(/* email: string, password: string */) {
    this.isLoggedIn.set(true);
    this.localStorage.setItem(KEY_USER_TOKEN, 'mockToken');
    // this.authApiService
    //   .signup({ email, password })
    //   .pipe(
    //     catchError((error: ErrorResponse) => {
    //       console.warn('Login error:', error);
    //       return throwError(() => new Error(error.reason));
    //     })
    //   )
    //   .subscribe((response: any) => {
    //     this.isLoggedIn.set(true);
    //     this.localStorage.setItem(KEY_USER_TOKEN, response.token);
    //   });
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
