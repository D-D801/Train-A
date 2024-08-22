import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { Component } from '@angular/core';
import { CarriagePreviewComponent } from './carriage-preview.component';

@Component({
  template: ` <dd-carriage-preview [carriage]="carriage"></dd-carriage-preview>`,
  standalone: true,
})
class TestPreviewComponent {
  public carriage = {
    rows: 2,
    leftSeats: 3,
    rightSeats: 3,
  } as Carriage;
}

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
