import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import { StationsApiService } from '../services/stations-api/stations-api.service';
import { StationsService } from '../services/stations/stations.service';

export const stationsResolver: ResolveFn<unknown> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<unknown> => {
  const stationsApiService = inject(StationsApiService);
  const stationsService = inject(StationsService);

  switch (state.url) {
    case '/admin/stations':
      return stationsApiService.retrieveStationList().pipe(tap((stations) => stationsService.setStations(stations)));
    default:
      return EMPTY;
  }
};
