import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: SearchApiService, useValue: { search: () => {} } },
        { provide: LocationApiService, useValue: { getLocationCoordinates: () => {} } },
      ],
      imports: [SearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
