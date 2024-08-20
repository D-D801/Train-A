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
  routes: Array<Route>;
}

interface Route {
  id: number;
  path: Array<number>;
  carriages: Array<string>;
  schedule: Array<Ride>;
}

interface Ride {
  rideId: number;
  segments: Array<RoadSection>;
}

interface RoadSection {
  time: Array<string>;
  price: {
    [carriageType: string]: number;
  };
  occupiedSeats: Array<number>;
}
