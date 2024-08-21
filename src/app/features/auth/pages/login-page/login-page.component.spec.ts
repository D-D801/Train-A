import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockLoginPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as submitted on signin', () => {
    component.onSubmit();
    expect(component.isSubmitted()).toBeTruthy();
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
