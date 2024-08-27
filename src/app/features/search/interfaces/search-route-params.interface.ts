export interface SearchRouteParams {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  time: number;
}

export interface RouteParams {
  rideId: string;
  from: number;
  to: number;
}
