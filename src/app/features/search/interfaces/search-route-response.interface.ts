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

interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Ride[];
}

interface Ride {
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
