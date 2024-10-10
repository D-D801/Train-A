import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { CarriageCardComponent } from './carriage-card.component';

@Component({
  template: `<div carriage="carriage"></div>`,
  standalone: true,
})
class TestPreviewComponent {}

describe('CarriageCardComponent', () => {
  let component: TestPreviewComponent;
  let fixture: ComponentFixture<TestPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageCardComponent, TestPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
