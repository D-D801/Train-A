import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageFormComponent } from './carriage-form.component';

describe('CarriageFormComponent', () => {
  let component: CarriageFormComponent;
  let fixture: ComponentFixture<CarriageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
