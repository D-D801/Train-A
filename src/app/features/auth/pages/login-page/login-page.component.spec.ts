import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { LoginPageComponent } from './login-page.component';

const mockUser = { email: 'test@email.com', password: 'testtesttest' };

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  const authServiceMock = {
    signin: jest.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [provideRouter([]), provideHttpClient(), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as submitted and touched on signin', () => {
    component.onSubmit();
    expect(component.isSubmitted()).toBeTruthy();
  });

  it('should call authService.signin if form is valid', () => {
    component.form.setValue(mockUser);
    component.onSubmit();
    expect(authServiceMock.signin).toHaveBeenCalledWith(mockUser);
  });

  it('should disable submit button when form is pristine', () => {
    expect(component.checkSubmitStatus()).toBe(true);
  });
});
