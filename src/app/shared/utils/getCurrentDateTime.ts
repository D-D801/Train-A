import { TuiDay, TuiTime } from '@taiga-ui/cdk';

export function getCurrentDateTime(): [TuiDay, TuiTime] {
  const date = new Date();

  const tuiDay = new TuiDay(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const tuiTime = new TuiTime(date.getUTCHours(), date.getUTCMinutes());
  return [tuiDay, tuiTime];
}

export function getCurrentDate(): TuiDay {
  const date = new Date();

  const tuiDay = new TuiDay(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return tuiDay;
}
