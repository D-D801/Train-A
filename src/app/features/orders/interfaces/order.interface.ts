import { Ride } from '@features/search/interfaces/search-route-response.interface';

export interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled';
  path: number[];
  carriages: string[];
  schedule: Ride;
  stationEnd: number;
  stationStart: number;
}
