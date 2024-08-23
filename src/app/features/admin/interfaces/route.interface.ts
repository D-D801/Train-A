import { Segment } from './segment.interface';

export interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
}

interface Schedule {
  rideId: number;
  segments: Segment[];
}
