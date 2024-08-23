import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockCarriage, mockCarriages } from '@shared/constants/mock-data/mock-carriages.data';
import { CarriageApiService } from './carriage-api.service';

describe('CarriageApiService', () => {
  let service: CarriageApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CarriageApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch carriages', () => {
    service.getCarriages().subscribe((carriages) => {
      expect(carriages).toEqual(mockCarriages);
    });

    const req = httpMock.expectOne('/api/carriage');
    expect(req.request.method).toBe('GET');
    req.flush(mockCarriages);
  });

  it('should create a carriage', () => {
    service.createCarriage(mockCarriage).subscribe((carriage) => {
      expect(carriage).toEqual(mockCarriage);
    });

    const req = httpMock.expectOne('/api/carriage');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCarriage);
    req.flush(mockCarriage);
  });

  it('should update a carriage', () => {
    service.updateCarriage(mockCarriage).subscribe((carriage) => {
      expect(carriage).toEqual(mockCarriage);
    });

    const req = httpMock.expectOne(`/api/carriage/${mockCarriage.code}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockCarriage);
    req.flush(mockCarriage);
  });
});
