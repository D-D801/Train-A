import { TuiDialogOptions } from '@taiga-ui/core';

export interface WithData<T> extends Partial<TuiDialogOptions<T>> {}

export interface ModalRideInfo {
  from: number;
  to: number;
  ride: Ride;
}

export interface Segment {
  time: [string, string];
  price: { [key: string]: number };
  occupiedSeats: number[];
}

export interface Ride {
  carriages: string[];
  path: number[];
  rideId: number;
  routeId: number;
  schedule: {
    segments: Segment[];
  };
}
