import { Schedule } from '@features/admin/interfaces/schedule.interface';

import { Segment } from '@features/admin/interfaces/segment.interface';

export const mockSegments: Segment[] = [{ time: ['1', '1'], price: { car: 1 } }] as const;

export const mockRide: Schedule = {
  rideId: 1,
  segments: mockSegments,
} as const;
