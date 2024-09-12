import { Trip } from '@features/search/interfaces/trip.interface';
import { TuiDialogOptions } from '@taiga-ui/core';

export interface WithData<T> extends Partial<TuiDialogOptions<T>> {}

export interface ModalRideInfo {
  from: number;
  to: number;
  ride: Trip;
}
