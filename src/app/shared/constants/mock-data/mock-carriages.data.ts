import { Carriage } from '@features/admin/interfaces/carriage.interface';

export const mockCarriage: Carriage = {
  code: 'test-carriage',
  name: 'Test Carriage',
  rows: 5,
  leftSeats: 3,
  rightSeats: 2,
};

export const mockCarriages: Carriage[] = [
  { code: 'carriage-1', name: 'carriage-1', rows: 2, leftSeats: 3, rightSeats: 3 },
  { code: 'carriage-2', name: 'carriage-2', rows: 1, leftSeats: 2, rightSeats: 2 },
];
