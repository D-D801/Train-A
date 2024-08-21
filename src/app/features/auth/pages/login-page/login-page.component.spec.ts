import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AlertService } from '@core/services/alert/alert.service';
import { of, throwError } from 'rxjs';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { mockLoginUser } from '@shared/constants/mock-user-data';
import { Component } from '@angular/core';
import { LoginPageComponent } from './login-page.component';

@Component({
  selector: 'dd-mock-login-page',
  standalone: true,
})
class MockLoginPageComponent extends LoginPageComponent {
  public override onSubmit(): void {
    super.onSubmit();
  }

  public override checkSubmitStatus(): boolean {
    return super.checkSubmitStatus();
  }
}

describe('LoginPageComponent', () => {
  let component: MockLoginPageComponent;
  let fixture: ComponentFixture<MockLoginPageComponent>;
  const authServiceMock = {
    signin: jest.fn(() => of({})),
  };
  const routerMock = {
    navigate: jest.fn(),
  };
  const alertServiceMock = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockLoginPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error correctly on signin failure', () => {
    authServiceMock.signin.mockReturnValueOnce(
      throwError(() => ({
        error: {
          message: 'User already exists',
        },
      }))
    );
    component.form.setValue({ email: 'test@example.com', password: 'password123' });

    component.onSubmit();

    expect(component.form.controls.email.errors).toEqual({ authError: true });
    expect(component.form.controls.password.errors).toEqual({ authError: true });
    expect(alertServiceMock.open).toHaveBeenCalledWith({
      message: 'User already exists',
      label: 'Error:',
      appearance: 'error',
    });
  });

  it('should call authService.signin if form is valid', () => {
    component.form.setValue(mockLoginUser);
    component.onSubmit();
    expect(authServiceMock.signin).toHaveBeenCalledWith(mockLoginUser);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not call authService.signin if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authServiceMock.signin).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should disable submit button when form is pristine', () => {
    expect(component.checkSubmitStatus()).toBe(true);
  });
});
