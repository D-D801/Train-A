export function generateDates(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const datesArray: { departureDate: string; rideIds: number[] }[] = [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    datesArray.push({
      departureDate: new Date(currentDate).toISOString(),
      rideIds: [],
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesArray;
}
