import { ResolveFn } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import { StationsApiService } from '../services/stations-api/stations-api.service';
import { StationsService } from '../services/stations/stations.service';

// TODO: delete stationsResolver
export const stationsResolver: ResolveFn<unknown> = (): Observable<unknown> => {
  const stationsApiService = inject(StationsApiService);
  const stationsService = inject(StationsService);
  return stationsApiService.retrieveStationList().pipe(tap((stations) => stationsService.setStations(stations)));
};
