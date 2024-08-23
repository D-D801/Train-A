import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ProfileFieldComponent } from './profile-field.component';

@Component({
  template: `<dd-profile-field [label]="label" text="text"></dd-profile-field>`,
})
class TestHostComponent {
  public label = 'email';

  public text = 'user@example.com';
}

describe('ProfileFieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ProfileFieldComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create ProfileFieldComponent', () => {
    const profileFieldComponent = fixture.debugElement.children[0].componentInstance;
    expect(profileFieldComponent).toBeTruthy();
  });
});
