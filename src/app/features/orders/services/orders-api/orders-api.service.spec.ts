import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { OrdersApiService } from './orders-api.service';

describe('OrdersService', () => {
  let service: OrdersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(OrdersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
