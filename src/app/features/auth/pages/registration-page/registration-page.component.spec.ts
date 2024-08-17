import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@features/auth/services/auth.service';
import { RegistrationPageComponent } from './registration-page.component';

const mockUser = {
  email: 'test@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
  name: 'John',
  lastName: 'Doe',
};

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;
  const authServiceMock = {
    signup: jest.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPageComponent],
      providers: [provideRouter([]), provideHttpClient(), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as submitted and touched on signup', () => {
    component.signup();
    expect(component.formSubmitted).toBeTruthy();
    expect(component.hasClickedSubmit).toBeTruthy();
    expect(component.registrationForm.touched).toBeTruthy();
  });

  it('should call authService.signup if form is valid', () => {
    component.registrationForm.setValue(mockUser);

    component.signup();
    expect(authServiceMock.signup).toHaveBeenCalledWith(mockUser);
  });

  it('should not call authService.signup if form is invalid', () => {
    component.registrationForm.setValue({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      lastName: '',
    });

    component.signup();
    expect(authServiceMock.signup).not.toHaveBeenCalled();
  });
});
