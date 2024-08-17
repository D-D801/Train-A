import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockTokenResponse, mockUser } from '@shared/constants/mock-user-data';
import { AuthApiService } from './auth-api.service';
import { UserRequest, UserResponse } from '../interfaces/auth.interface';

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

  it('should call signup endpoint and then signin endpoint', () => {
    const userRequest: UserRequest = mockUser;
    const signupResponse: UserResponse = mockTokenResponse;
    const signinResponse: UserResponse = mockTokenResponse;

    service.signup(userRequest).subscribe((response) => {
      expect(response).toEqual(signinResponse);
    });

    const signupRequest = httpMock.expectOne('/api/signup');
    expect(signupRequest.request.method).toBe('POST');
    signupRequest.flush(signupResponse);

    const signinRequest = httpMock.expectOne('/api/signin');
    expect(signinRequest.request.method).toBe('POST');
    signinRequest.flush(signinResponse);
  });
});
