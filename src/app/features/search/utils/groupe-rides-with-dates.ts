import { DepartureDateWithId, DepartureDateWithIds } from '@features/search/interfaces/filter-dates.interface';

export function groupeRidesWithDates(
  dates: DepartureDateWithIds[],
  sortedRidesWidthDepartureDate: DepartureDateWithId[]
) {
  return dates.map((dateWithRides) => {
    const findDate = sortedRidesWidthDepartureDate.filter((date) => date.departureDate === dateWithRides.departureDate);
    const rideIds = findDate.map((item) => item.rideId);

    return {
      ...dateWithRides,
      rideIds: [...rideIds],
    };
  });
}
