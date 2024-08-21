import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CarriagePageComponent } from './carriage-page.component';

describe('CarriagePageComponent', () => {
  let component: CarriagePageComponent;
  let fixture: ComponentFixture<CarriagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagePageComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
