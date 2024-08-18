import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

describe('ChangePasswordDialogComponent', () => {
  let component: ChangePasswordDialogComponent;
  let fixture: ComponentFixture<ChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialogComponent],
      providers: [
        provideHttpClient(),
        {
          provide: POLYMORPHEUS_CONTEXT,
          useValue: { data: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
