import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  let service: ProfileApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(ProfileApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
