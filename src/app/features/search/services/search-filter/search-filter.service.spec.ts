import { TestBed } from '@angular/core/testing';

import { SearchFilterService } from './search-filter.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
