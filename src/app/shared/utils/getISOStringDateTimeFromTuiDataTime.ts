import { TuiDay, TuiTime } from '@taiga-ui/cdk';

export function getISOStringDateTimeFromTuiDataTime(date: [TuiDay | null, TuiTime | null]) {
  const [day, time] = date;

  if (!(day && time)) return null;

  return new Date(day.year, day.month, day.day, time.hours, time.minutes).toISOString();
}
