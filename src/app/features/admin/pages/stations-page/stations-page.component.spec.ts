import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsApiService } from '@features/admin/services/stations-api/stations-api.service';
import { signal } from '@angular/core';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { provideHttpClient } from '@angular/common/http';
import { StationsPageComponent } from './stations-page.component';

describe('StationsPageComponent', () => {
  let component: StationsPageComponent;
  let fixture: ComponentFixture<StationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: StationsApiService, useValue: { stations: signal(null) } },
        { provide: LocationApiService, useValue: { getLocationCoordinates: () => {} } },
      ],
      imports: [StationsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
