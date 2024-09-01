import { TuiDialogOptions } from '@taiga-ui/core';

export interface WithData<T> extends Partial<TuiDialogOptions<T>> {}

export interface ModalRideInfo {
  rideId: number;
  from: number;
  to: number;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[];
  };
}

export interface Segment {
  time: [string, string];
  price: { [key: string]: number };
  occupiedSeats: number[];
}
