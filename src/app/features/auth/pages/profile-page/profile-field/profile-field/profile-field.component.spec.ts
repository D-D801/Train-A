import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFieldComponent } from './profile-field.component';

describe('ProfileFieldComponent', () => {
  let component: ProfileFieldComponent;
  let fixture: ComponentFixture<ProfileFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
