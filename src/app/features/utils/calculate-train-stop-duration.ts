export function calculateStopDuration(arrival: string, departure: string): string {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const diffMs = Math.abs(departureDate.getTime() - arrivalDate.getTime());

  const minutes = Math.floor(diffMs / 1000 / 60) % 60;
  const hours = Math.floor(diffMs / 1000 / 60 / 60) % 24;
  const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  if (days > 0) {
    return `${days}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  }
  return `${minutes} min`;
}
