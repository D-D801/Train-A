import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { mockUser } from '@shared/constants/mock-data/mock-user-data';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { Component } from '@angular/core';
import { RegistrationPageComponent } from './registration-page.component';

@Component({
  selector: 'dd-mock-registration-page',
  standalone: true,
})
class MockRegistrationPageComponent extends RegistrationPageComponent {
  public override onSubmit(): void {
    super.onSubmit();
  }

  public override checkSubmitStatus(): boolean {
    return super.checkSubmitStatus();
  }
}

describe('RegistrationPageComponent', () => {
  let component: MockRegistrationPageComponent;
  let fixture: ComponentFixture<MockRegistrationPageComponent>;
  const authServiceMock = {
    signup: jest.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockRegistrationPageComponent],
      providers: [provideRouter([]), provideHttpClient(), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MockRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.signup if form is valid', () => {
    component.registrationForm.setValue(mockUser);
    component.onSubmit();
    expect(authServiceMock.signup).toHaveBeenCalledWith({
      email: mockUser.email,
      password: mockUser.password.trim(),
    });
  });

  it('should not call authService.signup if form is invalid', () => {
    component.registrationForm.setValue({
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.onSubmit();
    expect(authServiceMock.signup).not.toHaveBeenCalled();
  });

  it('should disable submit button when form is pristine', () => {
    expect(component.checkSubmitStatus()).toBe(true);
  });
});
