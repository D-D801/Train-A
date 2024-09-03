import { SearchRouteResponse } from '@features/search/interfaces/search-route-response.interface';
import { convertDateToISODateWithoutTime } from '@shared/utils/date-converter';

export function findDepartureDatesOfRide(searchRouteResponse: SearchRouteResponse) {
  const ridesWidthDepartureDate = searchRouteResponse.routes.map((route) => {
    const indexPaths = route.path.indexOf(searchRouteResponse.from.stationId);
    return route.schedule.map((ride) => {
      const departureDate = new Date(ride.segments[indexPaths].time[0]);
      return { rideId: ride.rideId, departureDate: convertDateToISODateWithoutTime(departureDate) };
    });
  });
  const sortedRidesWidthDepartureDate = ridesWidthDepartureDate
    .flat()
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
  return sortedRidesWidthDepartureDate;
}
