import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchApiService } from '@features/search/services/search-api/search-api.service';
import { LocationApiService } from '@features/search/services/location-api/location-api.service';
import { of } from 'rxjs';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: SearchApiService,
          useValue: {
            search: () => of({ from: null, to: null }),
          },
        },
        { provide: LocationApiService, useValue: { getLocationCoordinates: () => {} } },
      ],
      imports: [SearchFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
