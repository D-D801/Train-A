import { Schedule } from '@shared/interfaces/schedule.interface';

export interface Order {
  carriages: string[];
  id: number;
  path: number[];
  rideId: number;
  routeId: number;
  schedule: Schedule;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled';
  stationEnd: number;
  stationStart: number;
}
