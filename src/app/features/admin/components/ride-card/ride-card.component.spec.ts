import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ComponentRef } from '@angular/core';
import { mockRide } from '@shared/constants/mock-data/mock-ride.data';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RideCardComponent } from './ride-card.component';

describe('RideCardComponent', () => {
  let component: RideCardComponent;
  let componentRef: ComponentRef<RideCardComponent>;
  let fixture: ComponentFixture<RideCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideCardComponent],
      providers: [provideHttpClient(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(RideCardComponent);
    component = fixture.componentInstance;

    componentRef = fixture.componentRef;
    componentRef.setInput('ride', mockRide);
    componentRef.setInput('routeId', 1);
    componentRef.setInput('path', [1, 2]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
