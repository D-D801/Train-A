import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';

const BASE_API_URL = 'path';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private httpClient: HttpClient) {}

  signup(body: { email: string; password: string }) {
    return this.httpClient
      .post(`${BASE_API_URL}/api/signup`, {
        body,
      })
      .pipe(switchMap(() => this.signin(body)));
  }

  signin(body: { email: string; password: string }) {
    return this.httpClient.post(`${BASE_API_URL}/api/signin`, {
      body,
    });
  }

  profile(body: { email: string; password: string }) {
    return this.httpClient.post(`${BASE_API_URL}/api/profile`, {
      body,
    });
  }
}
