import { CityCoordinates } from './city-coordinates.interface';

export interface SearchRouteResponse {
  from: {
    stationId: number;
    city: string;
    geolocation: CityCoordinates;
  };
  to: {
    stationId: number;
    city: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
  };
  routes: Route[];
}
// TODO: replace the interface with existing ones
export interface SearchResultListParams {
  from: SearchFromStation;
  to: SearchToStation;
  rideIds: number[];
}

export interface SearchFromStation {
  stationId: number;
  city: string;
}

export interface SearchToStation {
  stationId: number;
  city: string;
}

interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Ride[];
}

export interface Ride {
  rideId: number;
  segments: RoadSection[];
}

export interface RoadSection {
  time: string[];
  price: {
    [carriageType: string]: number;
  };
  occupiedSeats: number[];
}

export interface Trip {
  rideId: number;
  routeId: number;
  path: number[];
  carriages: string[];
  schedule: Ride;
}
