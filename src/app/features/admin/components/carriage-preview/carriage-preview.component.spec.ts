import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { CarriagePreviewComponent } from './carriage-preview.component';

@Component({
  template: `<div carriage="carriage"></div>`,
  standalone: true,
})
class TestPreviewComponent {}

describe('CarriagePreviewComponent', () => {
  let component: TestPreviewComponent;
  let fixture: ComponentFixture<TestPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagePreviewComponent, TestPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
