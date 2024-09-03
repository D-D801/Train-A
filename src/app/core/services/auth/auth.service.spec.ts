import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { TuiAlertService } from '@taiga-ui/core';
import { mockTokenResponse, mockUser } from '@shared/constants/mock-data/mock-user-data';
import { LocalStorageKey } from '@shared/enums/local-storage-key.enum';
import { AuthApiService } from '@features/auth/services/auth-api/auth-api.service';
import { AuthService } from './auth.service';

describe('AuthServiceService', () => {
  let service: AuthService;
  const authApiServiceMock = {
    signup: jest.fn(),
    signin: jest.fn(),
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

  it('should set isLoggedIn to true, store token, and update role on successful signup', () => {
    authApiServiceMock.signup.mockReturnValue(of(mockTokenResponse));
    authApiServiceMock.signin.mockReturnValue(of(mockTokenResponse));

    service.signup(mockUser).subscribe(() => {
      expect(localStorageServiceMock.setItem).toHaveBeenCalledWith(LocalStorageKey.UserToken, mockTokenResponse.token);
      expect(localStorageServiceMock.setItem).toHaveBeenCalledWith(LocalStorageKey.UserRole, 'admin'); // если роль администратора
      expect(service.isLoggedIn()).toBeTruthy();
    });
  });

  it('should show notification and not navigate on signup error', () => {
    const errorResponse = { error: { message: 'Error message' } };
    authApiServiceMock.signup.mockReturnValue(throwError(() => errorResponse));

    service.signup(mockUser).subscribe({
      error: () => {
        expect(routerMock.navigate).not.toHaveBeenCalled();
      },
    });
  });
});
