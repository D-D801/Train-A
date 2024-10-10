import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockTokenResponse, mockUser } from '@shared/constants/mock-data/mock-user-data';
import { UserRequest } from '@features/auth/interfaces/user-request.interface';
import { UserResponse } from '@features/auth/interfaces/user-response.interface';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call signup endpoint', () => {
    const userRequest: UserRequest = mockUser;
    const signupResponse: UserResponse = mockTokenResponse;

    service.signup(userRequest).subscribe((response) => {
      expect(response).toEqual(signupResponse);
    });

    const signupRequest = httpMock.expectOne('/api/signup');
    expect(signupRequest.request.method).toBe('POST');
    signupRequest.flush(signupResponse);
  });

  it('should call signin endpoint', () => {
    const userRequest: UserRequest = mockUser;
    const signinResponse: UserResponse = mockTokenResponse;

    service.signin(userRequest).subscribe((response) => {
      expect(response).toEqual(signinResponse);
    });

    const signinRequest = httpMock.expectOne('/api/signin');
    expect(signinRequest.request.method).toBe('POST');
    signinRequest.flush(signinResponse);
  });
});
