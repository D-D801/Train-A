import { TuiDay, TuiTime } from '@taiga-ui/cdk';

export function getISOStringDateTimeFromTuiDataTime(date: [TuiDay, TuiTime]) {
  const [day, time] = date;

  if (!(day && time)) return '';

  return new Date(day.year, day.month, day.day, time.hours, time.minutes).toISOString();
}
