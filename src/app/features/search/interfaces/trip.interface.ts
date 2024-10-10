import { Schedule } from '@shared/interfaces/schedule.interface';

export interface Trip {
  rideId: number;
  routeId: number;
  path: number[];
  carriages: string[];
  schedule: Schedule;
}
