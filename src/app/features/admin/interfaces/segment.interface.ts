export interface Segment {
  time: [string, string];
  price: Price;
}

interface Price {
  [carriage: string]: number;
}
