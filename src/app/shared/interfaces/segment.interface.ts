export interface Segment {
  time: [string, string];
  price: Price;
  occupiedSeats?: number[];
}

export interface Price {
  [carriage: string]: number;
}
