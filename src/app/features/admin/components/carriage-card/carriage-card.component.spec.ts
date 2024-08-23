import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageCardComponent } from './carriage-card.component';

describe('CarriageCardComponent', () => {
  let component: CarriageCardComponent;
  let fixture: ComponentFixture<CarriageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
