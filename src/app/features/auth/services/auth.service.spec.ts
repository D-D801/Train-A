import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage.service';
import { TuiAlertService } from '@taiga-ui/core';
import { mockTokenResponse, mockUser } from '@shared/constants/mock-user-data';
import { AuthService } from './auth.service';
import { AuthApiService } from './auth-api.service';
import { UserRequest, UserResponse } from '../interfaces/auth.interface';

const KEY_USER_TOKEN = 'userToken';

describe('AuthServiceService', () => {
  let service: AuthService;
  const authApiServiceMock = {
    signup: jest.fn(),
  };
  const localStorageServiceMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  const routerMock = {
    navigate: jest.fn(),
  };
  const alertServiceMock = {
    open: jest.fn(() => of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AuthService,
        { provide: AuthApiService, useValue: authApiServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TuiAlertService, useValue: alertServiceMock },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoggedIn to true, store token, and navigate to home on successful signup', () => {
    const userResponse: UserResponse = mockTokenResponse;
    authApiServiceMock.signup.mockReturnValue(of(userResponse));

    const userRequest: UserRequest = mockUser;
    service.signup(userRequest);

    expect(service.isLoggedIn()).toBeTruthy();
    expect(localStorageServiceMock.setItem).toHaveBeenCalledWith(KEY_USER_TOKEN, 'testToken');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show notification and not navigate on signup error', () => {
    const errorResponse = { error: { message: 'Error message' } };
    authApiServiceMock.signup.mockReturnValue(throwError(() => errorResponse));

    const userRequest: UserRequest = mockUser;
    service.signup(userRequest);

    expect(alertServiceMock.open).toHaveBeenCalledWith('Error message', { label: 'Error:', appearance: 'error' });
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should logout and remove token', () => {
    service.logout();

    expect(localStorageServiceMock.removeItem).toHaveBeenCalledWith(KEY_USER_TOKEN);
    expect(service.isLoggedIn()).toBe(false);
    expect(service.isAdminIn()).toBe(false);
  });
});
