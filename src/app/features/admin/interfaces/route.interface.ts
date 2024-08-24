import { Schedule } from './schedule.interface';

export interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
}
