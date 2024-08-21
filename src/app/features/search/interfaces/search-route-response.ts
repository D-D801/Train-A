export interface SearchRouteResponse {
  from: {
    stationId: number;
    city: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
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

interface RoadSection {
  time: string[];
  price: {
    [carriageType: string]: number;
  };
  occupiedSeats: number[];
}
