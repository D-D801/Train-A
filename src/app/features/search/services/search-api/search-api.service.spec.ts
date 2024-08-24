import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchRouteResponse } from '@features/search/interfaces/search-route-response.interface';
import { SearchRouteParams } from '@features/search/interfaces/search-route-params.interface';
import { SearchApiService } from './search-api.service';

describe('SearchService', () => {
  let service: SearchApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SearchApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call search endpoint', () => {
    const searchRouteRequest: SearchRouteParams = {
      fromLatitude: 48.8575,
      fromLongitude: 2.3514,
      toLatitude: 40.4167,
      toLongitude: 3.7033,
      time: 1723669200000,
    };
    const searchRouteResponse: SearchRouteResponse = {
      from: {
        stationId: 5,
        city: 'Paris',
        geolocation: {
          latitude: 48.8575,
          longitude: 2.3514,
        },
      },
      to: {
        stationId: 48,
        city: 'Madrid',
        geolocation: {
          latitude: 40.4167,
          longitude: 3.7033,
        },
      },
      routes: [
        {
          id: 64,
          path: [33, 5, 62, 11, 48, 34],
          carriages: [
            'carriage_type_2',
            'carriage_type_2',
            'carriage_type_2',
            'carriage_type_2',
            'carriage_type_7',
            'carriage_type_7',
            'carriage_type_7',
            'carriage_type_7',
          ],
          schedule: [
            {
              rideId: 44,
              segments: [
                {
                  time: ['2024-08-08T22:19:57.708Z', '2024-08-12T03:29:57.708Z'],
                  price: {
                    'dynamic-carriage-type-1': 210,
                  },
                  occupiedSeats: [0],
                },
              ],
            },
          ],
        },
      ],
    };
    service.search(searchRouteRequest).subscribe((response) => {
      expect(response).toEqual(searchRouteResponse);
    });

    const searchRequest = httpMock.expectOne(
      '/api/search?fromLatitude=48.8575&fromLongitude=2.3514&toLatitude=40.4167&toLongitude=3.7033&time=1723669200000'
    );
    expect(searchRequest.request.method).toBe('GET');
    searchRequest.flush(searchRouteResponse);
  });
});
