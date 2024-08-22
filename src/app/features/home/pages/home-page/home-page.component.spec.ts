import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchApiService } from '@features/home/services/search-api/search-api.service';
import { LocationApiService } from '@features/home/services/location-api/location-api.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: SearchApiService, useValue: { search: () => {} } },
        { provide: LocationApiService, useValue: { getLocationCoordinates: () => {} } },
      ],
      imports: [HomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
