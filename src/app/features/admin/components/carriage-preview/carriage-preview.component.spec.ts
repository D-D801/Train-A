import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carriage } from '@features/admin/interfaces/carriage.interface';
import { CarriagePreviewComponent } from './carriage-preview.component';

describe('CarriagePreviewComponent', () => {
  let component: CarriagePreviewComponent;
  let fixture: ComponentFixture<CarriagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagePreviewComponent);
    component = fixture.componentInstance;

    component.carriage = {
      code: 'ABC123',
      name: 'Test Carriage',
      rows: 10,
      leftSeats: 20,
      rightSeats: 20,
    } as Carriage;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
