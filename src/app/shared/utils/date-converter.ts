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

export function dateConverter(date: string) {
  const isoDate = new Date(date);

  const month = months[isoDate.getMonth()];
  const day = isoDate.getDate();
  const hours = String(isoDate.getUTCHours()).padStart(2, '0');
  const minutes = String(isoDate.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${month} ${day}, ${hours}:${minutes}`;
  return formattedDate;
}

export function dateConverter2(date: string) {
  const isoDate = new Date(date);

  const month = months[isoDate.getMonth()];
  const day = isoDate.getDate();
  const dayOfWeek = daysOfWeek[isoDate.getUTCDay()];

  return `${month} ${day} ${dayOfWeek}`;
}

export function convertDateToISODateWithoutTime(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  return new Date(Date.UTC(year, month, day)).toISOString();
}
