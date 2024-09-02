export interface Segment {
  time: [string, string];
  price: Price;
}

export interface Price {
  [carriage: string]: number;
}
