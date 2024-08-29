import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ComponentRef } from '@angular/core';
import { mockSegments } from '@shared/constants/mock-data/mock-ride.data';
import { StationCardComponent } from './station-card.component';

describe('StationCardComponent', () => {
  let component: StationCardComponent;
  let componentRef: ComponentRef<StationCardComponent>;
  let fixture: ComponentFixture<StationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationCardComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(StationCardComponent);
    component = fixture.componentInstance;

    componentRef = fixture.componentRef;
    componentRef.setInput('segments', { segments: mockSegments, indexSegment: 1 });
    componentRef.setInput('ids', { routeId: 1, rideId: 1 });
    componentRef.setInput('station', [1, 2]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
