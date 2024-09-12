import { Segment } from './segment.interface';

export interface Schedule {
  rideId: number;
  segments: Segment[];
}
