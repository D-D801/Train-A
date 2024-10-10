import { Schedule } from './schedule.interface';

export interface TrainRoute {
  id: number;
  carriages: string[];
  path: number[];
  schedule: Schedule[];
}
