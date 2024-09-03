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

export interface SearchFromStation {
  stationId: number;
  city: string;
  geolocation: CityCoordinates;
}

export interface SearchToStation {
  stationId: number;
  city: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
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
