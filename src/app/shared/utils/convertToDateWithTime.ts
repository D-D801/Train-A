const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function convertToDateWithTime(date: string) {
  const isoDate = new Date(date);

  const month = months[isoDate.getMonth()];
  const day = isoDate.getUTCDate();
  const hours = String(isoDate.getUTCHours()).padStart(2, '0');
  const minutes = String(isoDate.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${month} ${day}, ${hours}:${minutes}`;
  return formattedDate;
}

export function convertToDate(date: string) {
  const isoDate = new Date(date);

  const month = months[isoDate.getMonth()];
  const day = isoDate.getDate();
  const dayOfWeek = daysOfWeek[isoDate.getUTCDay()];

  return `${month} ${day} ${dayOfWeek}`;
}

export function convertToTime(date: string): string {
  const isoDate = new Date(date);

  const hours = isoDate.getUTCHours().toString().padStart(2, '0');
  const minutes = isoDate.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
