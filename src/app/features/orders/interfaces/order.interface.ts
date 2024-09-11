import { Ride } from '@features/search/interfaces/search-route-response.interface';

export interface Order {
  carriages: string[];
  id: number;
  path: number[];
  rideId: number;
  routeId: number;
  schedule: Ride;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled';
  stationEnd: number;
  stationStart: number;
}
