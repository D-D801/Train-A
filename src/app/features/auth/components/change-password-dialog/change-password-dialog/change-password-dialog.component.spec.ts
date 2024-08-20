import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { ProfileService } from '@features/auth/services/profile/profile.service';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

describe('ChangePasswordDialogComponent', () => {
  let component: ChangePasswordDialogComponent;
  let fixture: ComponentFixture<ChangePasswordDialogComponent>;
  const profileServiceMock = {
    updatePassword: jest.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialogComponent],
      providers: [
        provideHttpClient(),
        {
          provide: POLYMORPHEUS_CONTEXT,
          useValue: { data: of({}) },
        },
        { provide: ProfileService, useValue: profileServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call profileService.updatePassword on valid submit', () => {
    const newPasswordControl = component.changePasswordForm.controls.newPassword;
    newPasswordControl.setValue('ValidPass123!');

    component.submit();

    expect(profileServiceMock.updatePassword).toHaveBeenCalledWith('ValidPass123!');
  });

  it('should not call profileService.updatePassword if form is invalid', () => {
    component.submit();

    expect(profileServiceMock.updatePassword).not.toHaveBeenCalled();
  });
});
