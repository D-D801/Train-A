import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileField2Component } from './profile-field2.component';

describe('ProfileField2Component', () => {
  let component: ProfileField2Component;
  let fixture: ComponentFixture<ProfileField2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileField2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileField2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
