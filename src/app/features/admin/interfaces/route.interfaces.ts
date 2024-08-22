export interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
}

interface Schedule {
  rideId: number;
  segments: Segments[];
}

interface Segments {
  time: [string, string];
  price: Price;
}

interface Price {
  [carriage: string]: number;
}
