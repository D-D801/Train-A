export interface SearchRouteParams {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  time: string;
}

export interface RouteParams {
  rideId: string;
  from: number;
  to: number;
}
