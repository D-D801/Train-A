import { TuiDay, TuiTime } from '@taiga-ui/cdk';

export function getCurrentDateTime(): [TuiDay | null, TuiTime | null] {
  const date = new Date();

  const tuiDay = new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  const tuiTime = new TuiTime(date.getHours(), date.getMinutes());

  return [tuiDay, tuiTime];
}
