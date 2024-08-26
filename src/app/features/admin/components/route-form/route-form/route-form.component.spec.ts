import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteFormComponent } from './route-form.component';

@Component({
  template: `<div trainRoute="trainRoute"></div>`,
  standalone: true,
})
class TestPreviewComponent {}
describe('RouteFormComponent', () => {
  let component: TestPreviewComponent;
  let fixture: ComponentFixture<TestPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteFormComponent, TestPreviewComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
