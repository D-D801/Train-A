export function dateConverter(date: string) {
  const isoDate = new Date(date);

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

  const month = months[isoDate.getMonth()];
  const day = isoDate.getDate();
  const hours = String(isoDate.getUTCHours()).padStart(2, '0');
  const minutes = String(isoDate.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${month} ${day}, ${hours}:${minutes}`;
  return formattedDate;
}
